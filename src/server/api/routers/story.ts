import type { Language } from "@prisma/client";
import { TRPCError, type inferProcedureOutput } from "@trpc/server";
import readingTime from "reading-time";
import { z } from "zod";
import { THUMBNAILS } from "~/data/thumbnails";
import { env } from "~/env";
import { EmailQueue } from "~/lib/email/queue";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { generateChapter } from "~/utils/ai21";
import {
  LANGUAGES,
  METRICS_DEFAULT_VALUES,
  READERSHIP_ANALYTICS_DEFAULT_VALUES,
  chapterCollectionName,
  chunkCollectionName,
  cuidRegex,
} from "~/utils/constants";
import { GENRES } from "~/utils/genre";
import { makeSlug, mongoObjectId } from "~/utils/helpers";
import { processChapterContent } from "./chapter";

export const NCardEntity = {
  id: true,
  slug: true,
  title: true,
  readingTime: true,
  isMature: true,
  thumbnail: true,
  isCompleted: true,
  genreSlug: true,
  chapterCount: true,
  readCount: true,
  averageRating: true,
  ratingCount: true,
  author: {
    select: {
      name: true,
    },
  },
};

// search filter schema
const filterSchema = z.object({
  query: z.string().optional(),
  genre: z.string().optional(),
  sortBy: z.string().optional(),
  status: z.array(z.enum(["COMPLETED", "MATURE"])).optional(),
  contentType: z.array(z.enum(["AI_GENREATED", "ORIGINAL"])).optional(),
  minChapterCount: z.number().optional(),
  maxChapterCount: z.number().optional(),
  minViewsCount: z.number().optional(),
  maxViewsCount: z.number().optional(),
  publishedAt: z
    .enum(["LAST_WEEK", "LAST_MONTH", "LAST_YEAR", "ALL_TIME"])
    .optional(),
  tags: z.array(z.string()).optional(),
});

export const storyRouter = createTRPCRouter({
  test: publicProcedure.query(() => {
    return {
      status: "Success",
    };
  }),

  getNovels: protectedProcedure.query(async ({ ctx }) => {
    const novels = await ctx.postgresDb.story.findMany({
      where: {
        authorId: ctx.session?.user.id,
      },
      select: NCardEntity,
    });

    return novels;
  }),

  latest: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(8),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const stories = await ctx.postgresDb.story.findMany({
          orderBy: [
            {
              createdAt: "desc",
            },
            {
              readCount: "desc",
            },
            {
              averageRating: "desc",
            },
          ],
          select: {
            ...NCardEntity,
            createdAt: true,
          },
          take: input.limit * 2,
        });

        // Apply engagement boost to recent stories
        const now = new Date();
        const boostedStories = stories.map((story) => {
          const hoursSinceCreation =
            (now.getTime() - story.createdAt.getTime()) / (1000 * 60 * 60);
          const engagementScore = story.readCount * (story.averageRating || 1);

          // Boost stories that are less than 24 hours old and have good engagement
          const timeBoost = hoursSinceCreation < 24 ? 1.5 : 1;
          const engagementBoost = engagementScore > 0 ? 1.2 : 1;

          return {
            ...story,
            _rankingScore: timeBoost * engagementBoost,
          };
        });

        // Sort by ranking score
        return boostedStories
          .sort((a, b) => (b._rankingScore || 0) - (a._rankingScore || 0))
          .slice(0, input.limit)
          .map(({ _rankingScore, ...story }) => story);
      } catch (err) {
        console.error("Error fetching stories:", err);
        throw new Error("Error fetching stories");
      }
    }),

  rising: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(8),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const stories = await ctx.postgresDb.story.findMany({
          select: {
            ...NCardEntity,
            createdAt: true,
            updatedAt: true,
          },
          take: input.limit * 2, // Fetch more stories to apply ranking algorithm
        });

        const now = new Date();
        const rankedStories = stories.map((story) => {
          // Calculate time-based metrics
          const ageInHours =
            (now.getTime() - story.createdAt.getTime()) / (1000 * 60 * 60);
          const updateAgeInHours =
            (now.getTime() - story.updatedAt.getTime()) / (1000 * 60 * 60);

          // Calculate engagement metrics
          const viewsPerHour = story.readCount / Math.max(ageInHours, 1);
          const ratingWeight = story.averageRating || 0;
          const ratingCountWeight = Math.log10(story.ratingCount + 1);

          // Calculate chapter velocity (chapters per day)
          const daysSinceCreation = ageInHours / 24;
          const chapterVelocity =
            story.chapterCount / Math.max(daysSinceCreation, 1);

          // Calculate momentum score (recent activity)
          const momentumScore = updateAgeInHours < 24 ? 1.5 : 1;

          // Calculate final ranking score
          const rankingScore =
            viewsPerHour * 0.3 + // View velocity
            ratingWeight * 0.25 + // Rating quality
            ratingCountWeight * 0.15 + // Rating quantity
            chapterVelocity * 0.2 + // Content velocity
            momentumScore * 0.1; // Recent activity

          return {
            ...story,
            _rankingScore: rankingScore,
          };
        });

        // Sort by ranking score and return top stories
        return rankedStories
          .sort((a, b) => (b._rankingScore || 0) - (a._rankingScore || 0))
          .slice(0, input.limit ?? 10)
          .map(({ _rankingScore, ...story }) => story);
      } catch (err) {
        console.error("Error fetching stories:", err);
        throw new Error("Error fetching stories");
      }
    }),

  recommendations: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(8),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = ctx.session?.user.id;

      if (!user) {
        // Not logged in: return a mix of top-rated and diverse genres
        const [topRated, diverse] = await Promise.all([
          ctx.postgresDb.story.findMany({
            orderBy: { averageRating: "desc" },
            select: NCardEntity,
            take: 4,
          }),
          ctx.postgresDb.story.findMany({
            orderBy: { readCount: "desc" },
            select: NCardEntity,
            take: 4,
          }),
        ]);
        const seen = new Set();
        return [...topRated, ...diverse]
          .filter((s) => {
            if (seen.has(s.id)) return false;
            seen.add(s.id);
            return true;
          })
          .slice(0, input.limit);
      }

      // 1. Get user reading history with frequency and genres
      const reads = await ctx.postgresDb.chapterRead.findMany({
        where: { readerKey: user },
        select: {
          frequency: true,
          chapter: {
            select: {
              story: {
                select: {
                  tags: true,
                  ...NCardEntity,
                },
              },
            },
          },
        },
      });

      // 2. Count genre frequencies
      const genreFreq: Record<string, number> = {};
      const storyFreq: Record<string, number> = {};
      for (const read of reads) {
        const genre = read.chapter.story.genreSlug;
        genreFreq[genre] = (genreFreq[genre] || 0) + read.frequency;
        const storyId = read.chapter.story.id;
        storyFreq[storyId] = (storyFreq[storyId] || 0) + read.frequency;
      }
      const topGenres = Object.entries(genreFreq)
        .sort((a, b) => b[1] - a[1])
        .map(([g]) => g)
        .slice(0, 3);

      // 3. 4 from different genres (not in top genres)
      const diverseGenreStories = await ctx.postgresDb.story.findMany({
        where: {
          genreSlug: { notIn: topGenres },
        },
        select: NCardEntity,
        take: 4,
      });

      // 4. 4 from genres/titles user interacted with most
      const topStoryIds = Object.entries(storyFreq)
        .sort((a, b) => b[1] - a[1])
        .map(([id]) => id)
        .slice(0, 8);

      const familiarStories = await ctx.postgresDb.story.findMany({
        where: {
          id: { in: topStoryIds },
        },
        select: NCardEntity,
        take: 4,
      });

      // 5. Merge and dedupe
      const all = [...diverseGenreStories, ...familiarStories];
      const seen = new Set();
      const recommendations = all
        .filter((s) => {
          if (seen.has(s.id)) return false;
          seen.add(s.id);
          return true;
        })
        .slice(0, input.limit);

      return recommendations;
    }),

  completedStories: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(8),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = ctx.session?.user.id;
      if (!user) {
        // Not logged in: return a mix of top-rated and diverse completed stories
        const [topRated, diverse] = await Promise.all([
          ctx.postgresDb.story.findMany({
            where: { isCompleted: true },
            orderBy: { averageRating: "desc" },
            select: NCardEntity,
            take: 4,
          }),
          ctx.postgresDb.story.findMany({
            where: { isCompleted: true },
            orderBy: { readCount: "desc" },
            select: NCardEntity,
            take: 4,
          }),
        ]);
        // Dedupe and return
        const seen = new Set();
        return [...topRated, ...diverse]
          .filter((s) => {
            if (seen.has(s.id)) return false;
            seen.add(s.id);
            return true;
          })
          .slice(0, input.limit);
      }

      // 1. Get user reading history with genres
      const reads = await ctx.postgresDb.chapterRead.findMany({
        where: { readerKey: user },
        select: {
          chapter: {
            select: {
              story: {
                select: {
                  id: true,
                  genreSlug: true,
                  tags: true,
                },
              },
            },
          },
        },
      });

      // 2. Count genre frequencies
      const genreFreq: Record<string, number> = {};
      for (const read of reads) {
        const genre = read.chapter.story.genreSlug;
        genreFreq[genre] = (genreFreq[genre] || 0) + 1;
      }
      const topGenres = Object.entries(genreFreq)
        .sort((a, b) => b[1] - a[1])
        .map(([g]) => g)
        .slice(0, 3);

      // 3. 4 completed from different genres (not in top genres)
      const diverseCompleted = await ctx.postgresDb.story.findMany({
        where: {
          isCompleted: true,
          genreSlug: { notIn: topGenres },
        },
        select: NCardEntity,
        take: 4,
      });

      // 4. 4 completed from similar genres
      const similarCompleted = await ctx.postgresDb.story.findMany({
        where: {
          isCompleted: true,
          genreSlug: { in: topGenres },
        },
        select: NCardEntity,
        take: 4,
      });

      // 5. Merge and dedupe
      const all = [...diverseCompleted, ...similarCompleted];
      const seen = new Set();
      const completed = all
        .filter((s) => {
          if (seen.has(s.id)) return false;
          seen.add(s.id);
          return true;
        })
        .slice(0, input.limit);

      return completed;
    }),

  recentReads: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(8),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        // Get user's recent chapter reads with story details
        const recentReads = await ctx.postgresDb.chapterRead.findMany({
          where: {
            readerKey: ctx.session.user.id,
          },
          select: {
            frequency: true,
            lastRead: true,
            chapter: {
              select: {
                chapterNumber: true,
                title: true,
                story: {
                  select: {
                    ...NCardEntity,
                    chapters: {
                      select: {
                        chapterNumber: true,
                      },
                      orderBy: {
                        chapterNumber: "desc",
                      },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            lastRead: "desc",
          },
          take: input.limit * 2, // Fetch more to dedupe
        });

        // Dedupe by story, keep only the most recent read per story
        const seen = new Set();
        const recentStories = [];
        for (const read of recentReads) {
          const story = read.chapter.story;
          if (!story || seen.has(story.id)) continue;
          seen.add(story.id);

          // Progress calculation
          const lastReadChapter = read.chapter.chapterNumber;
          const totalChapters =
            story.chapters[0]?.chapterNumber || story.chapterCount || 1;
          const progress = Math.min(1, lastReadChapter / totalChapters);

          recentStories.push({
            ...story,
            lastRead: read.lastRead,
            lastReadChapter,
            totalChapters,
            progress,
          });

          if (recentStories.length >= input.limit) break;
        }

        // Sort by lastRead (most recent first)
        recentStories.sort(
          (a, b) =>
            (b.lastRead?.getTime?.() || 0) - (a.lastRead?.getTime?.() || 0)
        );

        return recentStories;
      } catch (err) {
        console.error("Error fetching recent reads:", err);
        throw new Error("Error fetching recent reads");
      }
    }),

  theLegendsSelf: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(8),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        // Get a larger pool of stories to apply the sophisticated ranking
        const stories = await ctx.postgresDb.story.findMany({
          select: {
            ...NCardEntity,
            createdAt: true,
            updatedAt: true,
            tags: true,
            synopsis: true,
          },
          take: input.limit * 3, // Get more stories to apply ranking
        });

        const now = new Date();
        const rankedStories = stories.map((story) => {
          // 1. Time-based metrics
          const ageInDays =
            (now.getTime() - story.createdAt.getTime()) / (1000 * 60 * 60 * 24);
          const updateAgeInDays =
            (now.getTime() - story.updatedAt.getTime()) / (1000 * 60 * 60 * 24);

          // 2. Engagement metrics
          const viewsPerDay = story.readCount / Math.max(ageInDays, 1);
          const ratingQuality = story.averageRating || 0;
          const ratingQuantity = Math.log10(story.ratingCount + 1);

          // 3. Content quality metrics
          const chapterDensity = story.chapterCount / Math.max(ageInDays, 1);
          const readingTimeScore = Math.log10(story.readingTime + 1);

          // 4. Legacy metrics
          const ageScore = Math.log10(ageInDays + 1);
          const updateFrequency = 1 / Math.max(updateAgeInDays, 1);

          // 5. Community engagement
          const engagementScore =
            (story.readCount * (story.averageRating || 0)) /
            Math.max(ageInDays, 1);

          // 6. Completion status bonus
          const completionBonus = story.isCompleted ? 1.5 : 1;

          // Calculate final ranking score with weighted components
          const rankingScore =
            // Legacy and Time Factors (30%)
            ageScore * 0.15 +
            updateFrequency * 0.15 +
            // Community Engagement (30%)
            viewsPerDay * 0.1 +
            ratingQuality * 0.1 +
            ratingQuantity * 0.1 +
            // Content Quality (25%)
            chapterDensity * 0.1 +
            readingTimeScore * 0.1 +
            engagementScore * 0.05 +
            // Completion Bonus (15%)
            completionBonus * 0.15;

          // Additional boost for stories with high engagement and age
          const legacyBoost = ageInDays > 30 && engagementScore > 100 ? 1.5 : 1;

          return {
            ...story,
            _rankingScore: rankingScore * legacyBoost,
            _metrics: {
              ageInDays,
              viewsPerDay,
              engagementScore,
              chapterDensity,
              ratingQuality,
              ratingQuantity,
            },
          };
        });

        // Sort by ranking score and apply additional filters
        const legends = rankedStories
          .sort((a, b) => (b._rankingScore || 0) - (a._rankingScore || 0))
          .filter((story) => {
            // Must have minimum engagement
            const minReads = 100;
            const minRatings = 10;
            const minAge = 7; // days

            return (
              story.readCount >= minReads &&
              story.ratingCount >= minRatings &&
              story._metrics.ageInDays >= minAge
            );
          })
          .slice(0, input.limit)
          .map(({ _rankingScore, _metrics, ...story }) => story);

        return legends;
      } catch (err) {
        console.error("Error fetching legends:", err);
        throw new Error("Error fetching legends");
      }
    }),

  similar: publicProcedure
    .input(
      z.object({
        storyId: z.string(),
        limit: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const story = await ctx.postgresDb.story.findUnique({
          where: {
            id: input.storyId,
          },
        });

        if (!story) {
          throw new Error("Story not found");
        }

        const stories = await ctx.postgresDb.story.findMany({
          where: {
            tags: {
              hasSome: story.tags,
            },
            id: {
              not: input.storyId,
            },
          },
          select: NCardEntity,
          orderBy: {
            averageRating: "desc",
          },
          take: input.limit,
        });

        return stories;
      } catch (err) {
        console.error("Error fetching similar stories:", err);
        throw new Error("Error fetching similar stories");
      }
    }),

  byID_or_slug: publicProcedure
    .input(
      z.object({
        query: z.string(), // this can be either ID or slug
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const story = await ctx.postgresDb.story.findFirst({
          where: {
            OR: [
              {
                id: cuidRegex.test(input.query) ? input.query : undefined,
              },
              {
                slug: !cuidRegex.test(input.query) ? input.query : undefined,
              },
            ],
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
            chapters: {
              select: {
                id: true,
                title: true,
                chapterNumber: true,
                metrics: true,
                readershipAnalytics: true,
                createdAt: true,
                isLocked: true,
                scheduledFor: true,
                price: true,
              },
              orderBy: {
                chapterNumber: "asc",
              },
            },
          },
        });

        if (!story) {
          throw new Error("Story not found");
        }

        return story;
      } catch (err) {
        console.error("Error fetching story by ID or slug:", err);
        throw new Error("Error fetching story");
      }
    }),

  simpleSearch: publicProcedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { query } = input;
      try {
        const stories = await ctx.postgresDb.story.findMany({
          where: {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { synopsis: { contains: query, mode: "insensitive" } },
              { author: { name: { contains: query, mode: "insensitive" } } },
              { tags: { hasSome: [query] } },
            ],
          },
          take: 5,
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
            author: {
              select: {
                name: true,
                username: true,
              },
            },
          },
        });

        return stories;
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),

  search: publicProcedure
    .input(
      z.object({
        ...filterSchema.shape,
        skip: z.number().optional(),
        limit: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const {
          query,
          genre,
          sortBy,
          status,
          contentType,
          minChapterCount,
          maxChapterCount,
          minViewsCount,
          maxViewsCount,
          publishedAt,
          tags,
          skip = 0,
          limit = 10,
        } = input;
        console.log({ query, genre });

        // Build where clause
        const where: any = {};

        // Text search across multiple fields
        if (query) {
          where.OR = [
            { title: { contains: query, mode: "insensitive" } },
            { synopsis: { contains: query, mode: "insensitive" } },
            { author: { name: { contains: query, mode: "insensitive" } } },
            { tags: { hasSome: [query] } },
          ];
        }

        // Genre filter
        if (genre) {
          where.genreSlug = {
            equals: makeSlug(genre),
            mode: "insensitive",
          };
        }

        // Status filters
        if (status) {
          const statusFilters: any = {};
          if (status.includes("COMPLETED")) {
            statusFilters.isCompleted = true;
          }
          if (status.includes("MATURE")) {
            statusFilters.isMature = true;
          }
          Object.assign(where, statusFilters);
        }

        // Content type filters
        if (contentType) {
          const contentFilters: any = {};
          if (contentType.includes("AI_GENREATED")) {
            contentFilters.hasAiContent = true;
          }
          if (contentType.includes("ORIGINAL")) {
            contentFilters.hasAiContent = false;
          }
          Object.assign(where, contentFilters);
        }

        // Chapter count range
        if (minChapterCount || maxChapterCount) {
          where.chapterCount = {};
          if (minChapterCount) where.chapterCount.gte = minChapterCount;
          if (maxChapterCount) where.chapterCount.lte = maxChapterCount;
        }

        // Views count range
        if (minViewsCount || maxViewsCount) {
          where.readCount = {};
          if (minViewsCount) where.readCount.gte = minViewsCount;
          if (maxViewsCount) where.readCount.lte = maxViewsCount;
        }

        // Publication date filter
        if (publishedAt) {
          const dateFilters: Record<string, Date> = {
            LAST_WEEK: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            LAST_MONTH: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            LAST_YEAR: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          };

          if (publishedAt in dateFilters) {
            where.createdAt = {
              gte: dateFilters[publishedAt],
            };
          }
        }

        // Tags filter
        if (tags && tags.length > 0) {
          where.tags = {
            hasSome: tags,
          };
        }

        // Determine sort order
        const orderBy: any = {};
        switch (sortBy?.toUpperCase()) {
          case "HOT":
            orderBy.averageRating = "desc";
            break;
          case "POPULAR":
            orderBy.readCount = "desc";
            break;
          case "LATEST":
            orderBy.createdAt = "desc";
            break;
          case "TOP RATED":
            orderBy.averageRating = "desc";
            break;
          default:
            orderBy.createdAt = "desc";
        }

        // Execute query with pagination
        const [stories, totalCount] = await Promise.all([
          ctx.postgresDb.story.findMany({
            where,
            orderBy,
            skip,
            take: limit,
            select: NCardEntity,
          }),
          ctx.postgresDb.story.count({ where }),
        ]);

        return {
          stories,
          metadata: {
            total: totalCount,
            page: Math.floor(skip / limit) + 1,
            pageSize: limit,
            pageCount: Math.ceil(totalCount / limit),
          },
        };
      } catch (err) {
        console.error("Error searching stories:", err);
        throw new Error("Error searching stories");
      }
    }),

  getStoryInfo: publicProcedure
    .input(z.object({ storyId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const story = await ctx.postgresDb.story.findUnique({
          where: {
            id: input.storyId,
          },
          select: {
            title: true,
            slug: true,
            storyStatus: true,
            thumbnail: true,
            chapters: {
              select: {
                id: true,
                title: true,
                chapterNumber: true,
                createdAt: true,
              },
              orderBy: {
                chapterNumber: "asc",
              },
            },
          },
        });

        return story;
      } catch (err) {
        console.error("Error fetching story info:", err);
        throw new Error("Error fetching story info");
      }
    }),

  getByGenre: publicProcedure
    .input(
      z.object({
        genre: z.string(),
        limit: z.number().optional(),
        skip: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const stories = await ctx.postgresDb.story.findMany({
          where: {
            genreSlug: {
              contains: input.genre,
              mode: "insensitive",
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: input.limit,
          skip: input.skip,
        });

        return stories;
      } catch (err) {
        console.error("Error fetching stories by genre:", err);
        throw new Error("Error fetching stories by genre");
      }
    }),

  getByAuthor: publicProcedure
    .input(
      z.object({
        author: z.string(), // can be id or username
        limit: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        const stories = await ctx.postgresDb.story.findMany({
          where: {
            authorId: uuidRegex.test(input.author) ? input.author : undefined,
          },
          orderBy: {
            createdAt: "desc",
          },
          select: NCardEntity,
          take: input.limit,
        });

        return stories;
      } catch (err) {
        console.error("Error fetching stories by author:", err);
        throw new Error("Error fetching stories by author");
      }
    }),

  // Mutations
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        synopsis: z.string(),
        genre: z.enum(GENRES.map((e) => e.slug) as [string, ...string[]]),
        tags: z.array(z.string()),
        thumbnail: z.object({
          url: z.string(),
          public_id: z.string(),
        }),

        isMature: z.boolean().default(false),
        hasAiContent: z.boolean().default(false),
        language: z.enum(
          LANGUAGES.map((lang) => lang.name) as [string, ...string[]]
        ),
        isLGBTQContent: z.boolean().default(false),
        edit: z.string().cuid().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = makeSlug(input.title);

        const { genre, thumbnail, edit, ...rest } = input;

        if (!edit) {
          const story = await ctx.postgresDb.story.create({
            data: {
              ...rest,
              authorId: ctx.session?.user.id,
              slug,
              thumbnailId: input.thumbnail.public_id,
              thumbnail: input.thumbnail.url,
              genreSlug: genre,
              readingTime: 0,
              language: input.language as Language,
            },
          });

          await EmailQueue.addToQueue({
            authorId: ctx.session.user.id,
            contentTitle: story.title,
            contentType: "story",
            contentUrl: `${env.NEXT_PUBLIC_APP_URL}/story/${story.slug}`,
          });

          return {
            id: story.id,
          };
        } else {
          const story = await ctx.postgresDb.story.update({
            where: {
              id: edit,
            },
            data: {
              ...rest,
              authorId: ctx.session?.user.id,
              slug,
              thumbnailId: input.thumbnail.public_id,
              thumbnail: input.thumbnail.url,
              genreSlug: genre,
              language: input.language as Language,
            },
          });
          return {
            id: story.id,
          };
        }
      } catch (err) {
        console.error("Error creating story:", err);
        throw new Error("Error creating story");
      }
    }),

  getAuthorReadingList: publicProcedure.query(() => {
    return [];
  }),

  rate: protectedProcedure
    .input(
      z.object({
        storyId: z.string().cuid(),
        rating: z.number().min(0).max(5),
        review: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { storyId, rating, review } = input;

        // check if user has read the story or not.
        const hasRead = await ctx.postgresDb.chapterRead.findFirst({
          where: {
            readerKey: ctx.session.user.id,
            chapter: {
              storyId: storyId,
            },
          },
          select: {
            id: true,
          },
        });

        if (!hasRead) {
          throw new TRPCError({
            message: "Read the story before leaving a review",
            code: "SERVICE_UNAVAILABLE",
          });
        }

        return await ctx.postgresDb.$transaction(async (tx) => {
          const story = await tx.story.findUnique({
            where: { id: storyId },
            select: {
              id: true,
              ratingCount: true,
              averageRating: true,
            },
          });

          if (!story) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Story not found",
            });
          }

          const existingRating = await tx.rating.findFirst({
            where: {
              userId: ctx.session.user.id,
              storyId,
            },
            select: {
              id: true,
              rating: true,
            },
          });

          let newRatingCount = story.ratingCount;
          let newAverageRating = story.averageRating;

          if (existingRating) {
            // Update existing rating
            const totalRating =
              story.averageRating * story.ratingCount -
              existingRating.rating +
              rating;
            newAverageRating = totalRating / story.ratingCount;

            await tx.rating.update({
              where: { id: existingRating.id },
              data: {
                rating,
                review,
                updatedAt: new Date(),
              },
            });
          } else {
            // Create new rating
            newRatingCount = story.ratingCount + 1;
            const totalRating =
              story.averageRating * story.ratingCount + rating;
            newAverageRating = totalRating / newRatingCount;

            await tx.rating.create({
              data: {
                storyId,
                userId: ctx.session.user.id,
                rating,
                review,
              },
            });
          }

          // Update story rating statistics
          await tx.story.update({
            where: { id: storyId },
            data: {
              ratingCount: newRatingCount,
              averageRating: newAverageRating,
            },
          });

          return {
            success: true,
            message: existingRating ? "Rating updated" : "Rating added",
            stats: {
              count: newRatingCount,
              average: newAverageRating,
            },
          };
        });
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while processing the rating",
        });
      }
    }),

  AIContentGeneration: publicProcedure.mutation(async ({ ctx }) => {
    try {
      const users = await ctx.postgresDb.user.findMany({
        where: {
          usedForAIContentGeneration: true,
        },
      });

      if (users.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No users available for AI content generation",
        });
      }

      const luckyUser = users[Math.floor(Math.random() * users.length)];

      const genres = await ctx.postgresDb.genres.findMany();
      const randomGenre = genres[Math.floor(Math.random() * genres.length)];

      const generatedContent = await generateChapter(randomGenre!.name);

      const story = await ctx.postgresDb.story.create({
        data: {
          title: generatedContent.storyTitle,
          slug: makeSlug(generatedContent.storyTitle),
          synopsis: generatedContent.storySynopsis,
          genreSlug: randomGenre!.slug,
          authorId: luckyUser!.id,
          hasAiContent: true,
          language: "English",
          thumbnail: getThumbnail(),
          thumbnailId: "default-thumbnail-id",
          readingTime: 0,
          tags: [...generatedContent.storyTags, "AI Generated"],
          storyStatus: "PUBLISHED",
        },
      });

      const chunks = processChapterContent(generatedContent.content);
      const objectId = mongoObjectId();

      const mongoContentID = await ctx.mongoDb
        .collection(chapterCollectionName)
        .insertOne({
          id: objectId,
          storyId: story.id,
          chapterNumber: 1,
          version: 1,
          createdAt: new Date(),
        });

      await Promise.all(
        chunks.map((chunk, index) =>
          ctx.mongoDb.collection(chunkCollectionName).insertOne({
            chapterId: mongoContentID.insertedId.toString(),
            content: chunk.content,
            index: index,
          })
        )
      );

      const isLocked = Math.random() > 0.5;

      const chapter = await ctx.postgresDb.chapter.create({
        data: {
          title: generatedContent.title,
          slug: makeSlug(generatedContent.title),
          chapterNumber: 1,
          storyId: story.id,
          isLocked,
          price: isLocked ? "POOL_50" : undefined,
          metrics: JSON.stringify({
            ...METRICS_DEFAULT_VALUES,
            wordCount: chunks.reduce((acc, chunk) => acc + chunk.wordCount, 0),
            readingTime: readingTime(generatedContent.content).time,
          }),
          readershipAnalytics: JSON.stringify(
            READERSHIP_ANALYTICS_DEFAULT_VALUES
          ),
          mongoContentID: [mongoContentID.insertedId.toString()],
        },
      });

      await ctx.postgresDb.story.update({
        where: { id: story.id },
        data: {
          chapterCount: 1,
          readingTime: readingTime(generatedContent.content).time,
        },
      });

      return {
        success: true,
        storyId: story.id,
        chapterId: chapter.id,
      };
    } catch (err) {
      console.error("Error in AI content generation:", err);
      if (err instanceof TRPCError) {
        throw err;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong while generating content using AI",
      });
    }
  }),

  getDataForEdit: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const story = await ctx.postgresDb.story.findUnique({
          where: {
            id: input.id,
            authorId: ctx.session.user.id,
          },
          select: {
            title: true,
            synopsis: true,
            tags: true,
            genreSlug: true,
            isMature: true,
            hasAiContent: true,
            language: true,
            isLGBTQContent: true,
            thumbnail: true,
            thumbnailId: true,
            storyStatus: true,
          },
        });

        if (!story) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Story not found",
          });
        }

        const { genreSlug, ...rest } = story;

        return {
          ...rest,
          genre: genreSlug,
        };
      } catch (err) {
        console.error("Error in AI content generation:", err);
        if (err instanceof TRPCError) {
          throw err;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while generating content using AI",
        });
      }
    }),
});

export type SearchResponse = inferProcedureOutput<typeof storyRouter.search>;
export type T_byID_or_slug = inferProcedureOutput<
  typeof storyRouter.byID_or_slug
>;

const getThumbnail = (): string => {
  return THUMBNAILS[Math.floor(Math.random() * THUMBNAILS.length)]!;
};
