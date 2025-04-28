import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { cuidRegex } from "~/utils/constants";
import { NCardEntity } from "./story";

export const userRouter = createTRPCRouter({
  getUserDetails: publicProcedure
    .input(
      z.object({
        usernameOrId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const usreIdOrUsername = input.usernameOrId ?? ctx.session?.user.id;

      if (!usreIdOrUsername) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username or ID is required",
        });
      }
      try {
        const user = await ctx.postgresDb.user.findFirst({
          where: {
            username: cuidRegex.test(usreIdOrUsername)
              ? undefined
              : usreIdOrUsername,
            id: cuidRegex.test(usreIdOrUsername) ? usreIdOrUsername : undefined,
          },

          include: {
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
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch user details",
        });
      }
    }),
});
