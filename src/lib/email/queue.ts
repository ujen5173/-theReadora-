import { Resend } from "resend";
import { env } from "~/env";
import { postgresDb } from "~/server/postgresql";
import { NewContentEmail } from "./templates/NewContentEmail";

const resend = new Resend(env.RESEND_KEY);
const BATCH_SIZE = 50; // Number of emails to send in each batch

interface EmailJob {
  authorId: string;
  contentTitle: string;
  contentType: "chapter" | "story";
  contentUrl: string;
}

export class EmailQueue {
  private static queue: EmailJob[] = [];
  private static isProcessing = false;

  static async addToQueue(job: EmailJob) {
    this.queue.push(job);
    if (!this.isProcessing) {
      await this.processQueue();
    }
  }

  private static async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    try {
      const job = this.queue.shift();
      if (!job) return;

      await this.processJob(job);
    } catch (error) {
      console.error("Error processing email queue:", error);
    } finally {
      this.isProcessing = false;
      if (this.queue.length > 0) {
        await this.processQueue();
      }
    }
  }

  private static async processJob(job: EmailJob) {
    const { authorId, contentTitle, contentType, contentUrl } = job;

    const author = await postgresDb.user.findUnique({
      where: { id: authorId },
      select: { name: true },
    });

    if (!author) return;

    let skip = 0;
    while (true) {
      const followers = await postgresDb.follow.findMany({
        where: { followingId: authorId },
        include: {
          follower: {
            select: {
              email: true,
              name: true,
            },
          },
        },
        skip,
        take: BATCH_SIZE,
      });

      if (followers.length === 0) break;

      await Promise.all(
        followers.map(async (follow) => {
          try {
            await resend.emails.send({
              from: "Readora <onboarding@resend.dev>",
              // to: follow.follower.email,
              to: "ujenbasi1122@gmail.com",
              subject: `New ${contentType} from ${author.name}: ${contentTitle}`,
              react: NewContentEmail({
                userEmail: follow.follower.email,
                authorName: author.name,
                contentTitle,
                contentType,
                contentUrl,
              }),
            });
          } catch (error) {
            console.error(
              `Failed to send email to ${follow.follower.email}:`,
              error
            );
          }
        })
      );

      skip += BATCH_SIZE;
    }
  }
}
