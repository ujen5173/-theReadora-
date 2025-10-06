import { chapterRouter } from "~/server/api/routers/chapter";
import { storyRouter } from "~/server/api/routers/story";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { affiliateRouter } from "./routers/affiliate";
import { analyticsRouter } from "./routers/analytics";
import { emailRouter } from "./routers/email";
import { genreRouter } from "./routers/genres";
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
  genres: genreRouter,
  analytics: analyticsRouter,
  affiliate: affiliateRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
