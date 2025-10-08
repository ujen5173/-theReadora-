import { TRPCError } from "@trpc/server";

import { customAlphabet } from "nanoid";
import { protectedProcedure } from "../trpc";

const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
const nanoid = customAlphabet(alphabet, 8);

export const generateAffiliateCode = () => nanoid();

export const affiliateRouter = {
  isUserEnrolled: protectedProcedure.query(async ({ ctx }) => {
    try {
      const res = await ctx.postgresDb.affiliate.count({
        where: {
          creatorId: ctx.session.user.id,
        },
      });

      return !!res;
    } catch (err) {
      if (err instanceof TRPCError) throw err;

      return false;
    }
  }),

  getCode: protectedProcedure.query(async ({ ctx }) => {
    try {
      const record = await ctx.postgresDb.affiliate.findFirst({
        where: { creatorId: ctx.session.user.id },
        select: { code: true },
      });

      return { code: record?.code ?? null };
    } catch (err) {
      if (err instanceof TRPCError) throw err;
      return { code: null };
    }
  }),

  enroll: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const exists = await ctx.postgresDb.affiliate.count({
        where: {
          creatorId: ctx.session.user.id,
        },
      });

      if (exists) return { success: true, already: true };

      await ctx.postgresDb.affiliate.create({
        data: {
          creatorId: ctx.session.user.id,
          code: generateAffiliateCode(),
        },
      });

      return { success: true, already: false };
    } catch (err) {
      if (err instanceof TRPCError) throw err;

      return { success: false, error: "Failed to enroll" };
    }
  }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const stats = await ctx.postgresDb.affiliate.findFirst({
      where: { creatorId: ctx.session.user.id },
      select: {
        earnings: true,
        clicks: true,
        _count: { select: { referrals: true } },
      },
    });

    return {
      coins: stats?.earnings ?? 0,
      clicks: stats?.clicks ?? 0,
      users: stats?._count.referrals ?? 0,
    };
  }),

  getHistory: protectedProcedure.query(async ({ ctx }) => {
    const affiliate = await ctx.postgresDb.affiliate.findFirst({
      where: { creatorId: ctx.session.user.id },
      select: { id: true },
    });

    if (!affiliate)
      return [] as { name: string; date: string; reward: string }[];

    const referredUsers = await ctx.postgresDb.user.findMany({
      where: { referredById: affiliate.id },
      select: { name: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return referredUsers.map((u) => ({
      name: u.name,
      date: u.createdAt.toISOString().slice(0, 10),
      reward: "+50 coins",
    }));
  }),
};
