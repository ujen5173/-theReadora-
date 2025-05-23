import type { Language } from "@prisma/client";
import { TRPCError, type inferProcedureOutput } from "@trpc/server";
import readingTime from "reading-time";
import { z } from "zod";
import { THUMBNAILS } from "~/data/thumbnails";
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
  thumbnailPlaceholder: true,
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
        limit: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const stories = await ctx.postgresDb.story.findMany({
          orderBy: {
            createdAt: "desc",
          },
          take: input.limit,
        });

        return stories;
      } catch (err) {
        console.error("Error fetching stories:", err);
        throw new Error("Error fetching stories");
      }
    }),

  rising: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const stories = await ctx.postgresDb.story.findMany({
          orderBy: {
            averageRating: "desc",
          },
          select: NCardEntity,
          take: input.limit,
        });

        return stories;
      } catch (err) {
        console.error("Error fetching stories:", err);
        throw new Error("Error fetching stories");
      }
    }),

  recommendations: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        // TODO: from readinglist and novels the user have interacted with.
        const user = await ctx.postgresDb.user.findUnique({
          where: {
            id: input.userId,
          },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const stories = await ctx.postgresDb.story.findMany({
          orderBy: {
            averageRating: "desc",
          },
          take: input.limit,
        });

        return stories;
      } catch (err) {
        console.error("Error fetching recommendations:", err);

        throw new Error("Error fetching recommendations");
      }
    }),

  completedStories: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const stories = await ctx.postgresDb.story.findMany({
          where: {
            isCompleted: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: input.limit,
        });

        return stories;
      } catch (err) {
        console.error("Error fetching completed stories:", err);
        throw new Error("Error fetching completed stories");
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
        const story = await ctx.postgresDb.story.findUnique({
          where: {
            id: cuidRegex.test(input.query) ? input.query : undefined,
            slug: !cuidRegex.test(input.query) ? input.query : undefined,
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
            ratings: {
              include: {
                user: {
                  select: {
                    image: true,
                    name: true,
                    id: true,
                    username: true,
                  },
                },
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
        console.log({ err });
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
            equals: genre.toLowerCase(),
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
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = makeSlug(input.title);

        const { genre, thumbnail, ...rest } = input;

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

        return {
          id: story.id,
        };
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
});

export type SearchResponse = inferProcedureOutput<typeof storyRouter.search>;
export type T_byID_or_slug = inferProcedureOutput<
  typeof storyRouter.byID_or_slug
>;

const getThumbnail = (): string => {
  return THUMBNAILS[Math.floor(Math.random() * THUMBNAILS.length)]!;
};
