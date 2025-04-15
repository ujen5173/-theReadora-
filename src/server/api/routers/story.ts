import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const storyRouter = createTRPCRouter({
  test: publicProcedure.query(() => {
    return {
      status: "Success",
    };
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return true;
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.story.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });
  }),
});
