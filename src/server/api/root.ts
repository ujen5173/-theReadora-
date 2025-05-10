import { chapterRouter } from "~/server/api/routers/chapter";
import { storyRouter } from "~/server/api/routers/story";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { paymentRouter } from "./routers/payment";
import { readinglistRouter } from "./routers/readinglist";
import { userRouter } from "./routers/user";

export const appRouter = createTRPCRouter({
  story: storyRouter,
  chapter: chapterRouter,
  user: userRouter,
  list: readinglistRouter,
  payment: paymentRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
