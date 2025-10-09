import { Resend } from "resend";
import { env } from "~/env";
import FeedbackEmail from "./templates/FeedbackEmail";
import MagicLinkEmail from "./templates/MagicLinkEmail";
import NewContentEmail from "./templates/NewContentEmail";

const resend = new Resend(env.RESEND_KEY);

export async function sendFeedbackEmail({
  feedback,
  userEmail,
  from,
}: {
  feedback: string;
  userEmail?: string | undefined;
  from?: "github" | "twitter" | "none" | "google" | "friends" | undefined;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Readora <onboarding@resend.dev>",
      to: ["ujenbasi1122@gmail.com"],
      subject: `New Feedback from ${userEmail ?? "Anonymous User"}`,
      react: FeedbackEmail({ feedback, userEmail, from }),
    });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending feedback email:", error);
    return { success: false, error };
  }
}

export async function sendNewContentEmail({
  userEmail,
  authorName,
  contentTitle,
  contentType,
  contentUrl,
}: {
  userEmail: string;
  authorName: string;
  contentTitle: string;
  contentType: "chapter" | "story";
  contentUrl: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Readora <onboarding@resend.dev>",
      to: [userEmail],
      subject: `New ${contentType} from ${authorName}: ${contentTitle}`,
      react: NewContentEmail({
        authorName,
        contentTitle,
        contentType,
        contentUrl,
        userEmail,
      }),
    });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending new content email:", error);
    return { success: false, error };
  }
}

export async function sendMagicLinkEmail({
  email,
  magicLink,
}: {
  email: string;
  magicLink: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Readora <onboarding@resend.dev>",
      to: [email],
      subject: "Your magic link to sign in to Readora",
      react: MagicLinkEmail({
        magicLink,
        userEmail: email,
      }),
    });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending magic link email:", error);
    return { success: false, error };
  }
}
