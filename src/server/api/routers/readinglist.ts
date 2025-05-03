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
        initialStories: z.array(z.string().cuid2()),
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
        initialStories: z.array(z.string().cuid2()),
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
        userId: z.string().cuid2(),
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
        console.log({ err });
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
});

export type TgetUserReadingList = inferProcedureOutput<
  typeof readinglistRouter.getUserReadingList
>;
