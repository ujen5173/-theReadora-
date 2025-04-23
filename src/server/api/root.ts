import { storyRouter } from "~/server/api/routers/story";
import { chapterRouter } from "~/server/api/routers/chapter";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  story: storyRouter,
  chapter: chapterRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
