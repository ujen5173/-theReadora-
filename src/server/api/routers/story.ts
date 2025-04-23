import type { Language } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { GENRES, LANGUAGES } from "~/utils/constants";
import { makeSlug } from "~/utils/helpers";

export type ChapterMetrics = {
  wordCount: number;
  readingTime: number;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
};

const NCardEntity = {
  id: true,
  slug: true,
  title: true,
  votes: true,
  reads: true,
  readingTime: true,
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
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        const story = await ctx.postgresDb.story.findUnique({
          where: {
            id: uuidRegex.test(input.query) ? input.query : undefined,
            slug: !uuidRegex.test(input.query) ? input.query : undefined,
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

        return {
          ...story,
          chapters: story.chapters.map((chapter) => ({
            ...chapter,
            metrics: JSON.parse(chapter.metrics as string),
          })),
        };
      } catch (err) {
        console.error("Error fetching story by ID or slug:", err);
        throw new Error("Error fetching story");
      }
    }),

  search: publicProcedure
    .input(
      z.object({
        query: z.string(),
        skip: z.number().optional(),
        limit: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        /* TODO:
          ? a very advance search by title, description, and tags, author, genre and other things.
          ? user can search by small title and author name or genre
          ? this search system will be very vast and can handle complex search
        */

        const stories = await ctx.postgresDb.story.findMany({
          where: {
            title: {
              contains: input.query,
              mode: "insensitive",
            },
            tags: {
              hasSome: input.query.split(" "),
            },
          },
          orderBy: {
            votes: "desc",
          },
          take: input.limit,
          skip: input.skip,
        });

        return stories;
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
});
