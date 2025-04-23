import { StoryStatus } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const chapterRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        wordCount: z.number(),

        status: z.nativeEnum(StoryStatus),
        storyId: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.storyId) {
        throw new Error("Story ID is required");
      }
    }),
});
