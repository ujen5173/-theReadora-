import { z } from "zod";
import { sendFeedbackEmail } from "~/lib/email/sendEmail";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const emailRouter = createTRPCRouter({
  sendFeedbackEmail: publicProcedure
    .input(
      z.object({
        feedback: z.string(),
        userEmail: z.string().optional(),
        from: z
          .enum(["github", "twitter", "none", "google", "friends"])
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { feedback, userEmail, from } = input;
        const result = await sendFeedbackEmail({
          feedback,
          userEmail,
          from,
        });

        return { success: true, result };
      } catch (err) {
        console.log({ err });
      }
    }),
});
