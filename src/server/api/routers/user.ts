import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { cuidRegex } from "~/utils/constants";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { NCardEntity } from "./story";

export const userRouter = createTRPCRouter({
  getUserDetails: publicProcedure
    .input(
      z.object({
        usernameOrId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userIdOrUsername = input.usernameOrId ?? ctx.session?.user.id;

      if (!userIdOrUsername) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username or ID is required",
        });
      }

      try {
        const isCuid = cuidRegex.test(userIdOrUsername);

        const user = await ctx.postgresDb.user.findFirst({
          where: isCuid
            ? { id: userIdOrUsername }
            : { username: userIdOrUsername },
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            createdAt: true,
            followersCount: true,
            followingCount: true,
            stories: {
              select: NCardEntity,
            },
          },
        });

        if (!user) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          image: user.image,
          createdAt: user.createdAt,
          followersCount: user.followersCount,
          followingCount: user.followingCount,
          stories: user.stories,
        };
      } catch (error) {
        console.log({ error });
        if (error instanceof TRPCError) {
          throw error; // Re-throw known TRPC errors
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch user details",
        });
      }
    }),

  follow: protectedProcedure
    .input(
      z.object({
        followingId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.session.user.id === input.followingId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot follow yourself",
          });
        }

        const existingFollow = await ctx.postgresDb.follow.findFirst({
          where: {
            followerId: ctx.session.user.id,
            followingId: input.followingId,
          },
        });

        if (existingFollow) {
          await Promise.all([
            ctx.postgresDb.follow.delete({
              where: {
                id: existingFollow.id,
              },
            }),
            ctx.postgresDb.user.update({
              where: {
                id: input.followingId,
              },
              data: {
                followersCount: {
                  decrement: 1,
                },
              },
            }),
            ctx.postgresDb.user.update({
              where: {
                id: ctx.session.user.id,
              },
              data: {
                followingCount: {
                  decrement: 1,
                },
              },
            }),
          ]);
          return { success: true, isFollowing: false };
        } else {
          await ctx.postgresDb.follow.create({
            data: {
              followerId: ctx.session.user.id,
              followingId: input.followingId,
            },
          });
          await Promise.all([
            ctx.postgresDb.user.update({
              where: {
                id: input.followingId,
              },
              data: {
                followersCount: {
                  increment: 1,
                },
              },
            }),
            ctx.postgresDb.user.update({
              where: {
                id: ctx.session.user.id,
              },
              data: {
                followingCount: {
                  increment: 1,
                },
              },
            }),
          ]);
          return { success: true, isFollowing: true };
        }
      } catch (error) {
        console.log({ error });
        if (error instanceof TRPCError) {
          throw error; // Re-throw known TRPC errors
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to follow user",
        });
      }
    }),

  followStatus: protectedProcedure
    .input(
      z.object({
        followingId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const followStatus = await ctx.postgresDb.follow.findFirst({
          where: {
            followerId: ctx.session.user.id,
            followingId: input.followingId,
          },
        });

        return !!followStatus;
      } catch (error) {
        console.log({ error });
        if (error instanceof TRPCError) {
          throw error; // Re-throw known TRPC errors
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch follow status",
        });
      }
    }),
});
