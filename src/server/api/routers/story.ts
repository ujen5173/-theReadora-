import type { Language } from "@prisma/client";
import type { inferProcedureOutput } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { GENRES, LANGUAGES, cuidRegex } from "~/utils/constants";
import { makeSlug } from "~/utils/helpers";

export type ChapterMetrics = {
  commentsCount: number;
  likesCount: number;
  ratingAvg: number;
  ratingCount: number;
  ratingValue: number;
  readingTime: number;
  sharesCount: number;
  viewsCount: number;
  wordCount: number;
};

export const NCardEntity = {
  id: true,
  slug: true,
  title: true,
  votes: true,
  readingTime: true,
  isMature: true,
  thumbnail: true,
  isCompleted: true,
  genreSlug: true,
  chapterCount: true,
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
  publishedAt: z.string().optional(),
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
            votes: "desc",
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
            votes: "desc",
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
            votes: "desc",
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
            chapters: {
              select: {
                id: true,
                title: true,
                readershipAnalytics: true,
                createdAt: true,
                metrics: true,
                chapterNumber: true,
              },
              orderBy: {
                createdAt: "asc",
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
          where.reads = {};
          if (minViewsCount) where.reads.gte = minViewsCount;
          if (maxViewsCount) where.reads.lte = maxViewsCount;
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
            orderBy.votes = "desc";
            break;
          case "POPULAR":
            orderBy.reads = "desc";
            break;
          case "LATEST":
            orderBy.createdAt = "desc";
            break;
          case "TOP RATED":
            orderBy.votes = "desc";
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

  // increaseReadCount: publicProcedure
  //   .input(z.object({ storyId: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     try {
  //       // TODO: complete this procedure
  //       const story = await ctx.postgresDb.story.update({
  //         where: {
  //           id: input.storyId,
  //         },
  //         data: {
  //           reads: {
  //             increment: 1,
  //           },
  //         },
  //       });
  //       return story;
  //     } catch (err) {
  //       console.error("Error increasing read count:", err);
  //       throw new Error("Error increasing read count");
  //     }
  //   }),

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
        genre: z.enum(GENRES),
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
            genreSlug: genre.toLowerCase(),
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
});

export type SearchResponse = inferProcedureOutput<typeof storyRouter.search>;
