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
  profileView: publicProcedure
    .input(z.object({ user: z.string().cuid2() }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.session?.user.id)
          return {
            success: false,
          };

        const userId = ctx.session.user.id;

        if (userId === input.user)
          return {
            success: false,
          };

        const prevViewed = await ctx.postgresDb.profileViews.findFirst({
          where: {
            viewedUserId: input.user,
            userId: userId,
          },
        });

        const now = new Date();

        const hoursSinceLastRead = prevViewed
          ? (now.getTime() - prevViewed.createdAt.getTime()) / (1000 * 60 * 60)
          : 25;

        // same views will be counted on a time difference of 24 hour.
        await ctx.postgresDb.$transaction([
          ...(hoursSinceLastRead > 24
            ? [
                ctx.postgresDb.profileViews.create({
                  data: {
                    viewedUserId: input.user,
                    userId: userId,
                  },
                }),
                ctx.postgresDb.user.update({
                  where: {
                    id: input.user,
                  },
                  data: {
                    profileViews: {
                      increment: 1,
                    },
                  },
                }),
              ]
            : []),
        ]);

        return {
          success: true,
        };
      } catch {}
    }),

  // TODO: fix the analytics, currently there is no raw array of data of each day.
  getProfileAnalytics: protectedProcedure
    .input(
      z
        .object({
          range: z.enum(["24h", "7d", "30d", "3m", "12m", "24m"]),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;

        // Gather base info
        const base = await ctx.postgresDb.user.findFirst({
          where: { id: userId },
          select: {
            followersCount: true,
            followingCount: true,
            name: true,
            image: true,
            stories: { select: { id: true } },
          },
        });

        if (!base) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }

        const storyIds = base.stories.map((s) => s.id);

        const now = new Date();
        const selected = input?.range ?? "7d";
        const rangeToMs = (range: typeof selected) => {
          switch (range) {
            case "24h":
              return 24 * 60 * 60 * 1000;
            case "7d":
              return 7 * 24 * 60 * 60 * 1000;
            case "30d":
              return 30 * 24 * 60 * 60 * 1000;
            case "3m":
              return 90 * 24 * 60 * 60 * 1000; // approx
            case "12m":
              return 365 * 24 * 60 * 60 * 1000; // approx
            case "24m":
              return 730 * 24 * 60 * 60 * 1000; // approx
          }
        };
        const span = rangeToMs(selected);
        const start = new Date(now.getTime() - span);
        const prevStart = new Date(now.getTime() - 2 * span);
        const prevEnd = start;

        // Story views (StoryDailyStats) - last n days vs previous n days
        const [recentStats, prevStats] = await Promise.all([
          ctx.postgresDb.storyDailyStats.findMany({
            where: {
              storyId: { in: storyIds },
              date: { gte: start, lte: now },
            },
            select: {
              totalViews: true,
              uniqueReaders: true,
              avgReadTime: true,
            },
          }),
          ctx.postgresDb.storyDailyStats.findMany({
            where: {
              storyId: { in: storyIds },
              date: { gte: prevStart, lte: prevEnd },
            },
            select: {
              totalViews: true,
              uniqueReaders: true,
              avgReadTime: true,
            },
          }),
        ]);

        const sumViews = (arr: { totalViews: number }[]) =>
          arr.reduce((s, x) => s + (x.totalViews || 0), 0);
        const sumUnique = (arr: { uniqueReaders: number }[]) =>
          arr.reduce((s, x) => s + (x.uniqueReaders || 0), 0);
        const avgRead = (arr: { avgReadTime: number }[]) =>
          arr.length === 0
            ? 0
            : Math.round(
                arr.reduce((s, x) => s + (x.avgReadTime || 0), 0) / arr.length
              );

        const recentViews = sumViews(recentStats);
        const prevViews = sumViews(prevStats);
        const recentUnique = sumUnique(recentStats);
        const prevUnique = sumUnique(prevStats);
        const recentAvgRead = avgRead(recentStats);
        const prevAvgRead = avgRead(prevStats);

        // Profile views - last n vs previous n
        const [recentProfileViews, prevProfileViews] = await Promise.all([
          ctx.postgresDb.profileViews.count({
            where: {
              viewedUserId: userId,
              createdAt: { gte: start, lte: now },
            },
          }),
          ctx.postgresDb.profileViews.count({
            where: {
              viewedUserId: userId,
              createdAt: { gte: prevStart, lte: prevEnd },
            },
          }),
        ]);

        const pct = (curr: number, prev: number) => {
          if (prev === 0) return curr > 0 ? 100 : 0;
          return Math.round(((curr - prev) / prev) * 100);
        };

        return {
          followersCount: base.followersCount,
          followingCount: base.followingCount,
          name: base.name,
          image: base.image,
          totalStories: storyIds.length,
          metrics: {
            novelViews: {
              value: recentViews,
              delta: pct(recentViews, prevViews),
              thisMonthRawData: recentViews,
            },
            profileViews: {
              value: recentProfileViews,
              delta: pct(recentProfileViews, prevProfileViews),
              thisMonthRawData: recentProfileViews,
            },
            retention: {
              value: recentAvgRead,
              delta: pct(recentAvgRead, prevAvgRead),
              thisMonthRawData: recentAvgRead,
            },
            uniqueReaders: {
              value: recentUnique,
              delta: pct(recentUnique, prevUnique),
              thisMonthRawData: recentUnique,
            },
            avgReadTimeSeconds: {
              value: recentAvgRead,
              delta: pct(recentAvgRead, prevAvgRead),
              thisMonthRawData: recentAvgRead,
            },

            _range: selected,
          },
        };
      } catch (err) {
        console.log({ err });
        if (err instanceof TRPCError) throw err;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong!",
        });
      }
    }),

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
          await ctx.postgresDb.$transaction([
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
          await ctx.postgresDb.$transaction([
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
      const data = (await ctx.postgresDb.readEvent.findMany({
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
