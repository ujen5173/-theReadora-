import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const reviewsRouter = createTRPCRouter({
  getMeta: publicProcedure
    .input(
      z.object({
        storyId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const metadata = await ctx.postgresDb.story.findUnique({
          where: {
            id: input.storyId,
          },
          select: {
            ratingCount: true,
            averageRating: true,
          },
        });

        return metadata;
      } catch (err) {
        if (err instanceof TRPCError) throw err;

        throw new TRPCError({
          message: "Something went wrong",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  getReviews: publicProcedure
    .input(
      z.object({
        storyId: z.string().cuid(),
        sortBy: z
          .enum(["LATEST", "OLDEST", "MOST_VOTES", "TOP"])
          .default("TOP"),
        limit: z.number().optional().default(4),
        skip: z.number().optional().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const reviews = await ctx.postgresDb.rating.findMany({
          where: {
            storyId: input.storyId,
          },
          select: {
            id: true,
            rating: true,
            review: true,
            createdAt: true,
            repliesCount: true,
            likesCount: true,
            userId: true,
            likes: {
              where: {
                id: ctx.session?.user.id ?? "",
              },
              select: {
                id: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
          take: input.limit,
          skip: input.skip,
        });

        const sortedReviews = reviews.sort((a, b) => {
          if (ctx.session?.user.id) {
            const aIsUserReview = a.userId === ctx.session.user.id;
            const bIsUserReview = b.userId === ctx.session.user.id;

            if (aIsUserReview && !bIsUserReview) return -1;
            if (!aIsUserReview && bIsUserReview) return 1;
          }

          switch (input.sortBy) {
            case "LATEST":
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            case "OLDEST":
              return (
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
              );
            case "MOST_VOTES":
              return b.likesCount - a.likesCount;
            default:
              return b.rating - a.rating;
          }
        });

        return sortedReviews;
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

  toggleLike: protectedProcedure
    .input(
      z.object({
        reviewId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const review = await ctx.postgresDb.rating.findUnique({
          where: {
            id: input.reviewId,
          },
          select: {
            likesCount: true,
            likes: {
              where: {
                id: ctx.session.user.id,
              },
              select: { id: true },
            },
          },
        });

        if (!review)
          throw new TRPCError({
            message: "Review not found",
            code: "BAD_REQUEST",
          });

        const isLiked = review.likes.length > 0;

        const res = await ctx.postgresDb.rating.update({
          where: {
            id: input.reviewId,
          },
          select: {
            likesCount: true,
            likes: {
              where: {
                id: ctx.session.user.id,
              },
              select: { id: true },
            },
          },
          data: {
            likesCount: {
              [isLiked ? "decrement" : "increment"]: 1,
            },
            likes: {
              [isLiked ? "disconnect" : "connect"]: {
                id: ctx.session.user.id,
              },
            },
          },
        });

        return res;
      } catch (err) {
        if (err instanceof TRPCError) throw err;

        throw new TRPCError({
          message: "Something went wrong",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  replyReview: protectedProcedure
    .input(
      z.object({
        reviewId: z.string().cuid(),
        parentId: z.string().cuid().optional(),
        reply: z.string().min(1).max(255),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = ctx.session.user.id;

        const res = await ctx.postgresDb.replies.create({
          data: {
            userId: user,
            reply: input.reply,
            ratingId: input.reviewId,
            parentId: input.parentId,
          },
        });

        return res;
      } catch (err) {
        if (err instanceof TRPCError) throw err;

        throw new TRPCError({
          message: "Something went wrong",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
