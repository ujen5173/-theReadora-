import { createTRPCRouter, publicProcedure } from "../trpc";

export const genreRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    const genres = await ctx.postgresDb.genres.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    return genres;
  }),
});
