import { TRPCError, type inferProcedureOutput } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { NCardEntity } from "./story";

export const readinglistRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        initialStories: z.array(z.string().cuid()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const newList = await ctx.postgresDb.readinglist.create({
          data: {
            title: input.title,
            description: input.description,
            user: { connect: { id: ctx.session.user.id } },
            stories: {
              create: input.initialStories.map((storyId) => ({
                story: { connect: { id: storyId } },
              })),
            },
          },
        });

        return { id: newList.id };
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          message: "Something went wrong",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().optional(),
        initialStories: z.array(z.string().cuid()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const readingList = await ctx.postgresDb.readinglist.findUnique({
          where: {
            id: input.id,
          },
          select: {
            userId: true,
          },
        });

        if (!readingList) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Reading list not found",
          });
        }

        if (readingList.userId !== ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to update this reading list",
          });
        }

        // First delete all existing stories connections
        await ctx.postgresDb.readinglistStory.deleteMany({
          where: {
            readinglistId: input.id,
          },
        });

        const updatedList = await ctx.postgresDb.readinglist.update({
          where: {
            id: input.id,
          },
          data: {
            title: input.title,
            description: input.description,
            stories: {
              create: input.initialStories.map((storyId) => ({
                story: { connect: { id: storyId } },
              })),
            },
          },
        });

        return { id: updatedList.id };
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          message: "Something went wrong",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  getUserReadingList: publicProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const result = await ctx.postgresDb.readinglist.findMany({
          where:
            ctx.session?.user.id === input.userId
              ? {
                  userId: input.userId,
                  isPrivate: false,
                }
              : {
                  userId: input.userId,
                },

          include: {
            stories: {
              select: {
                story: {
                  select: NCardEntity,
                },
              },
            },
          },
        });

        return result.map((e) => {
          return {
            ...e,
            stories: e.stories.map((e) => e.story),
          };
        });
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          message: "Something went wrong",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const readingList = await ctx.postgresDb.readinglist.findUnique({
          where: {
            id: input.id,
          },
          select: {
            userId: true,
          },
        });

        if (!readingList) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Reading list not found",
          });
        }

        if (readingList.userId !== ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to delete this reading list",
          });
        }

        await ctx.postgresDb.readinglist.delete({
          where: {
            id: input.id,
          },
        });

        return { success: true };
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          message: "Failed to delete reading list",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  getList: protectedProcedure.query(async ({ ctx, input }) => {
    const lists = await ctx.postgresDb.readinglist.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        id: true,
        title: true,
      },
    });

    return lists;
  }),

  // @params:
  // @id - story id
  // @listIds - multiple reading list ids
  addToList: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        listIds: z.array(z.string().cuid()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Get the story ID and reading list IDs
        const storyId = input.id;
        const readingListIds = input.listIds;

        // For each reading list, try to add the story
        await Promise.all(
          readingListIds.map(async (listId) => {
            // Check if user has permission to modify this list
            const readingList = await ctx.postgresDb.readinglist.findUnique({
              where: { id: listId },
              select: { userId: true },
            });

            if (!readingList) {
              return { listId, success: false, reason: "NOT_FOUND" };
            }

            if (readingList.userId !== ctx.session.user.id) {
              return { listId, success: false, reason: "FORBIDDEN" };
            }

            // Check if story already exists in this list
            const existingEntry =
              await ctx.postgresDb.readinglistStory.findUnique({
                where: {
                  readinglistId_storyId: {
                    readinglistId: listId,
                    storyId: storyId,
                  },
                },
              });

            if (existingEntry) {
              return { listId, success: true, reason: "ALREADY_EXISTS" };
            }

            // Add story to reading list
            await ctx.postgresDb.readinglistStory.create({
              data: {
                readinglist: { connect: { id: listId } },
                story: { connect: { id: storyId } },
              },
            });

            return { listId, success: true };
          })
        );

        return true;
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        } else {
          throw new TRPCError({
            message: "Something went wrong!!!",
            code: "INTERNAL_SERVER_ERROR",
          });
        }
      }
    }),

  getReadingListByid: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const readingList = await ctx.postgresDb.readinglist.findUnique({
          where: {
            id: input.id,
          },
          include: {
            stories: {
              select: {
                story: {
                  select: NCardEntity,
                },
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        });

        if (!readingList) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Reading list not found",
          });
        }

        if (
          readingList.isPrivate &&
          ctx.session?.user.id !== readingList.userId
        ) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "This reading list is private",
          });
        }

        return {
          ...readingList,
          stories: readingList.stories.map((e) => e.story),
        };
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          message: "Something went wrong",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  getStoryLists: protectedProcedure
    .input(
      z.object({
        storyId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const lists = await ctx.postgresDb.readinglist.findMany({
        where: {
          userId: ctx.session.user.id,
          stories: {
            some: {
              storyId: input.storyId,
            },
          },
        },
        select: {
          id: true,
          title: true,
        },
      });

      return lists;
    }),
});

export type TgetUserReadingList = inferProcedureOutput<
  typeof readinglistRouter.getUserReadingList
>;
