import { TRPCError, type inferProcedureOutput } from "@trpc/server";
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

  getAuthorReviews: protectedProcedure
    .input(
      z.object({
        query: z.string().optional(),
        rating: z.number().optional(),
        selectedWork: z.string().optional(),
        sorting: z.enum(["ALL", "MOST_LIKED", "LATEST", "OLDEST"]).optional(),
        limit: z.number().min(1).max(50).optional().default(20),
        skip: z.number().min(0).optional().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { query, limit, rating, selectedWork, sorting, skip } = input;
        const reviews = await ctx.postgresDb.rating.findMany({
          where: {
            AND: [
              // Apply rating filter only if provided
              ...(rating != null ? [{ rating }] : []),
              // Filter by selected work (storyId) if provided
              ...(selectedWork
                ? [
                    {
                      storyId: selectedWork,
                    },
                  ]
                : []),
              // Text search across review text and story fields if query provided
              ...(query
                ? [
                    {
                      OR: [
                        {
                          review: {
                            contains: query,
                            mode: "insensitive" as const,
                          },
                        },
                        {
                          story: {
                            OR: [
                              {
                                title: {
                                  contains: query,
                                  mode: "insensitive" as const,
                                },
                              },
                              {
                                slug: {
                                  contains: query,
                                  mode: "insensitive" as const,
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  ]
                : []),
              // Only reviews on stories authored by the current user
              {
                story: {
                  authorId: ctx.session.user.id,
                },
              },
            ],
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
                id: ctx.session.user.id,
              },
              select: {
                _count: true,
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
            story: {
              select: {
                id: true,
                title: true,
                slug: true,
                thumbnail: true,
              },
            },
          },
          orderBy:
            sorting === "MOST_LIKED"
              ? { likesCount: "desc" }
              : sorting === "OLDEST"
              ? { createdAt: "asc" }
              : { createdAt: "desc" }, // Default to LATEST or ALL
          take: limit,
          skip,
        });

        // Get total count for pagination
        const totalCount = await ctx.postgresDb.rating.count({
          where: {
            AND: [
              ...(rating != null ? [{ rating }] : []),
              ...(selectedWork
                ? [
                    {
                      storyId: selectedWork,
                    },
                  ]
                : []),
              ...(query
                ? [
                    {
                      OR: [
                        {
                          review: {
                            contains: query,
                            mode: "insensitive" as const,
                          },
                        },
                        {
                          story: {
                            OR: [
                              {
                                title: {
                                  contains: query,
                                  mode: "insensitive" as const,
                                },
                              },
                              {
                                slug: {
                                  contains: query,
                                  mode: "insensitive" as const,
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  ]
                : []),
              {
                story: {
                  authorId: ctx.session.user.id,
                },
              },
            ],
          },
        });

        return {
          reviews: reviews.map(({ likes, ...rest }) => ({
            ...rest,
            hasAuthorLike: !!likes,
          })),
          totalCount,
        };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch author reviews",
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

        // Start a transaction to ensure data consistency
        const res = await ctx.postgresDb.$transaction(async (tx) => {
          // Update the main review's reply count
          await tx.rating.update({
            where: { id: input.reviewId },
            data: { repliesCount: { increment: 1 } },
          });

          // Create the reply
          const reply = await tx.replies.create({
            data: {
              userId: user,
              reply: input.reply,
              ratingId: input.reviewId,
              parentId: input.parentId,
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  image: true,
                },
              },
              parent: {
                select: {
                  user: {
                    select: {
                      id: true,
                      username: true,
                      name: true,
                    },
                  },
                  reply: true,
                },
              },
            },
          });

          return reply;
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

  toggleReplyLike: protectedProcedure
    .input(
      z.object({
        replyId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const reply = await ctx.postgresDb.replies.findUnique({
          where: {
            id: input.replyId,
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

        if (!reply)
          throw new TRPCError({
            message: "Reply not found",
            code: "BAD_REQUEST",
          });

        const isLiked = reply.likes.length > 0;

        const res = await ctx.postgresDb.replies.update({
          where: {
            id: input.replyId,
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

  getReplies: publicProcedure
    .input(
      z.object({
        reviewId: z.string().cuid(),
        limit: z.number().optional().default(4),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const replies = await ctx.postgresDb.replies.findMany({
          where: {
            ratingId: input.reviewId,
          },
          take: input.limit,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
            parent: {
              select: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    name: true,
                  },
                },
                reply: true,
              },
            },
            likes: {
              where: {
                id: ctx.session?.user.id ?? "",
              },
              select: {
                id: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        return replies;
      } catch (err) {
        if (err instanceof TRPCError) throw err;

        throw new TRPCError({
          message: "Something went wrong",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  pinReview: protectedProcedure
    .input(
      z.object({
        reviewId: z.string().cuid(),
        status: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.postgresDb.rating.update({
          where: {
            story: {
              authorId: ctx.session.user.id,
            },
            id: input.reviewId,
          },
          data: {
            pin: input.status,
          },
        });
      } catch {}
    }),
});

export type TgetReplies = inferProcedureOutput<typeof reviewsRouter.getReplies>;
