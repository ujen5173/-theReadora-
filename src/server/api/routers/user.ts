import { type inferProcedureOutput, TRPCError } from "@trpc/server";
import { z } from "zod";
import type { TCard } from "~/app/_components/shared/novel-card";
import { cuidRegex } from "~/utils/constants";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { NCardEntity } from "./story";

type ChapterReadWithStory = {
  frequency: number;
  createdAt: Date;
  chapter: {
    story: TCard & {
      updatedAt: Date;
      createdAt: Date;
      tags: string[];
    };
  };
};

export type StoryWithMetadata = TCard & {
  frequency: number;
  lastRead: Date;
  updatedAt: Date;
  createdAt: Date;
  tags: string[];
};

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
            bio: true,
            premium: true,
            coins: true,
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

        return user;
      } catch (error) {
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
        if (error instanceof TRPCError) {
          throw error; // Re-throw known TRPC errors
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch follow status",
        });
      }
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.postgresDb.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        bio: true,
        email: true,
        premium: true,
        premiumUntil: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return user;
  }),

  checkUsername: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const { username } = input;

      const existingUser = await ctx.postgresDb.user.findFirst({
        where: {
          username,
        },
        select: {
          id: true,
        },
      });

      return !!existingUser;
    }),

  updateUser: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        username: z.string().optional(),
        bio: z.string().optional(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, username, bio, image } = input;

      const updatedUser = await ctx.postgresDb.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name,
          username,
          bio,
          image,
        },
      });

      return updatedUser;
    }),

  getPurchasesDetails: protectedProcedure.query(async ({ ctx }) => {
    const purchases = await ctx.postgresDb.transactions.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const balance = await ctx.postgresDb.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        coins: true,
        premium: true,
        premiumUntil: true,
        premiumSince: true,
        premiumPurchasedAt: true,
        purchaseMedium: true,
        purchaseId: true,
        transactionHistory: true,
        coinsLastUpdated: true,
      },
    });

    return {
      purchases,
      balance,
    };
  }),

  getRating: protectedProcedure
    .input(z.object({ storyId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const { storyId } = input;

      const rating = await ctx.postgresDb.rating.findFirst({
        where: {
          storyId,
          userId: ctx.session.user.id,
        },
      });

      return rating;
    }),

  hasUserUnlockedChapter: publicProcedure
    .input(z.object({ chapterIds: z.array(z.string().cuid()) }))
    .query(async ({ ctx, input }) => {
      try {
        if (!ctx.session?.user.id) return [];

        const response = await ctx.postgresDb.user.findFirst({
          where: {
            id: ctx.session.user.id,
          },
          select: {
            unlockedChapters: {
              where: {
                chapterId: {
                  in: input.chapterIds,
                },
              },
              select: {
                chapterId: true,
              },
            },
          },
        });

        return response?.unlockedChapters.map((e) => e.chapterId) ?? [];
      } catch (err) {
        if (err instanceof TRPCError) throw err;

        throw new TRPCError({
          message: "Something went wrong",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  getHistory: protectedProcedure.query(async ({ ctx, input }) => {
    try {
      const data = (await ctx.postgresDb.chapterRead.findMany({
        where: {
          readerKey: ctx.session.user.id,
        },
        select: {
          frequency: true,
          createdAt: true,
          chapter: {
            select: {
              story: {
                select: {
                  ...NCardEntity,
                  tags: true,
                  updatedAt: true,
                  createdAt: true,
                },
              },
            },
          },
        },
      })) as ChapterReadWithStory[];

      const uniqueStories = new Map<string, StoryWithMetadata>();

      data.forEach((item: ChapterReadWithStory) => {
        const story = item.chapter.story;
        const existingStory = uniqueStories.get(story.id);
        const currentReadTime = new Date(item.createdAt).getTime();

        if (!existingStory) {
          uniqueStories.set(story.id, {
            ...story,
            frequency: item.frequency,
            lastRead: item.createdAt,
          });
        } else {
          const existingReadTime = new Date(existingStory.lastRead).getTime();

          if (
            item.frequency > existingStory.frequency ||
            (item.frequency === existingStory.frequency &&
              currentReadTime > existingReadTime)
          ) {
            uniqueStories.set(story.id, {
              ...story,
              frequency: item.frequency,
              lastRead: item.createdAt,
            });
          }
        }
      });

      return Array.from(uniqueStories.values());
    } catch (err) {
      if (err instanceof TRPCError) {
        throw err;
      }

      throw new TRPCError({
        message: "Something went wrong while getting history of the user",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),

  changeNotificationPreference: protectedProcedure
    .input(
      z.object({
        chapterUpdates: z.boolean(),
        storyCompletion: z.boolean(),
        readingReminders: z.boolean(),
        storyRecommendations: z.boolean(),
        authorUpdates: z.boolean(),
        premiumBenefits: z.boolean(),
        coinsAndTransactions: z.boolean(),
        emailNotifications: z.boolean(),
        marketingEmails: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.postgresDb.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            emailPreferences: JSON.stringify(input),
          },
        });

        return true;
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }

        throw new TRPCError({
          message: "Something went wrong.",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  getEmailPreferences: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.postgresDb.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        emailPreferences: true,
      },
    });
  }),
});

export type TGetProfile = inferProcedureOutput<typeof userRouter.getProfile>;
