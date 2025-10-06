import { TRPCError } from "@trpc/server";

import { protectedProcedure } from "../trpc";

export const affiliateRouter = {
  isUserEnrolled: protectedProcedure.query(async ({ ctx }) => {
    try {
      const res = await ctx.postgresDb.affiliateStats.count({
        where: {
          userId: ctx.session.user.id,
        },
      });

      return !!res;
    } catch (err) {
      if (err instanceof TRPCError) throw err;

      return false;
    }
  }),

  enroll: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      // Check if already enrolled
      const exists = await ctx.postgresDb.affiliateStats.count({
        where: { userId: ctx.session.user.id },
      });

      if (exists) return { success: true, already: true };

      await ctx.postgresDb.affiliateStats.create({
        data: {
          userId: ctx.session.user.id,
          totalReferrals: 0,
          totalCoins: 0,
        },
      });
      return { success: true, already: false };
    } catch (err) {
      if (err instanceof TRPCError) throw err;

      return { success: false, error: "Failed to enroll" };
    }
  }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    // Get stats for the current user
    const stats = await ctx.postgresDb.affiliateStats.findUnique({
      where: { userId: ctx.session.user.id },
    });

    // Count users and vendors referred
    const referralsList = await ctx.postgresDb.affiliate.count({
      where: { parentUserId: ctx.session.user.id },
    });

    return {
      users: referralsList,
      coins: stats?.totalCoins ?? 0,
      totalReferrals: stats?.totalReferrals ?? 0,
    };
  }),

  getHistory: protectedProcedure.query(async ({ ctx }) => {
    // Get referral history for the current user
    const history = await ctx.postgresDb.affiliate.findMany({
      where: { parentUserId: ctx.session.user.id },
      include: { targetUser: true }, // Include related user data
      orderBy: { createdAt: "desc" },
    });

    // Map to frontend format
    const result = history.map((ref) => ({
      name: ref.targetUser?.name ?? "-",
      date: ref.createdAt.toISOString().slice(0, 10),
      reward: ref.coinsEarned,
    }));

    return result;
  }),
};
