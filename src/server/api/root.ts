import { chapterRouter } from "~/server/api/routers/chapter";
import { storyRouter } from "~/server/api/routers/story";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { emailRouter } from "./routers/email";
import { paymentRouter } from "./routers/payment";
import { readinglistRouter } from "./routers/readinglist";
import { reviewsRouter } from "./routers/reviews";
import { userRouter } from "./routers/user";

export const appRouter = createTRPCRouter({
  story: storyRouter,
  chapter: chapterRouter,
  user: userRouter,
  list: readinglistRouter,
  payment: paymentRouter,
  reviews: reviewsRouter,
  email: emailRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
