 
import { TRPCError, type inferProcedureOutput } from "@trpc/server";
import { AI21 } from "ai21";
import fs from "fs";
import path from "path";
import showdown from "showdown";
import { z } from "zod";
import { ChapterPricePool, StoryStatus } from "~/generated/enums";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  CHAPTER_PRICE_POOL,
  chapterCollectionName,
  chunkCollectionName,
  cuidRegex,
  METRICS_DEFAULT_VALUES,
} from "~/utils/constants";
import { makeSlug, mongoObjectId } from "~/utils/helpers";

const ai21 = new AI21({
  apiKey: process.env.AI21_API_KEY,
});

// Custom error types
class AI21Error extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "AI21Error";
  }
}

// Configuration
const CONFIG = {
  outputDir: path.resolve(process.cwd(), "ai-generated"),
  maxRetries: 3,
  maxFileAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Showdown configuration
const converter = new showdown.Converter({
  tables: true,
  tasklists: true,
  strikethrough: true,
  emoji: true,
  underline: true,
  ghCodeBlocks: true,
  parseImgDimensions: true,
  simplifiedAutoLink: true,
});

export const generateChapter = async (genre: string) => {
  let retries = 0;

  while (retries < CONFIG.maxRetries) {
    try {
      const prompt = `You are a skilled fiction author specializing in ${genre} stories. Create an engaging first chapter for a new story.

**Output Format**
Return a valid JSON object with these exact fields:
{
  "title": "Chapter title (max 6 words)",
  "storyTitle": "Story title (max 6 words)", 
  "storySynopsis": "2-3 paragraph synopsis (150-200 words total)",
  "storyTags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "content": "Chapter content in Markdown format (approximately 2000 words)"
}

**Writing Guidelines**
- Write in third person perspective
- Use vivid, sensory descriptions
- Include natural dialogue
- Build tension and intrigue
- Maintain consistent tone throughout
- Keep content PG-13 appropriate
- Avoid AI-generated clichés
- Create compelling characters and plot

**Content Requirements**
- The content field should contain the full chapter in Markdown
- Use proper paragraph breaks
- Include dialogue with proper formatting
- Build towards a compelling cliffhanger or hook
- Make it feel like a professional published work

**JSON Requirements**
- Must be valid JSON that parses without errors
- No extra text before or after the JSON
- All strings must be properly escaped
- Use double quotes for all keys and string values

Generate the JSON object now:`;

      const response = await ai21.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 4000,
        topP: 0.9,
        model: "jamba-mini-1.6-2025-03",
      });

      const content = response.choices[0]?.message.content;

      if (!content) {
        throw new AI21Error("No content generated from AI", "NO_CONTENT");
      }

      // Ensure output directory exists
      try {
        if (!fs.existsSync(CONFIG.outputDir)) {
          fs.mkdirSync(CONFIG.outputDir, { recursive: true });
        }
      } catch (error) {
        throw new AI21Error(`Failed to create output directory`, "FS_ERROR");
      }

      // Clean up old files
      try {
        const files = fs.readdirSync(CONFIG.outputDir);
        const now = Date.now();
        for (const file of files) {
          const filePath = path.join(CONFIG.outputDir, file);
          try {
            const stats = fs.statSync(filePath);
            if (now - stats.mtimeMs > CONFIG.maxFileAge) {
              fs.unlinkSync(filePath);
            }
          } catch (error) {
            console.warn(`Failed to process file ${file}:`, error);
            continue;
          }
        }
      } catch (error) {
        console.warn("Failed to clean up old files:", error);
      }

      // Save raw response
      const rawOutputPath = path.join(
        CONFIG.outputDir,
        `${response.id}-raw.json`
      );
      try {
        fs.writeFileSync(
          rawOutputPath,
          JSON.stringify(
            {
              content: content,
              generatedAt: new Date().toISOString(),
            },
            null,
            2
          )
        );
      } catch (error) {
        console.warn("Failed to save raw response:", error);
      }

      // Clean and parse content
      const cleanedContent = content
        .replace(/```json\s*/g, "")
        .replace(/```\s*$/g, "")
        .trim();

      let parsedContent;
      try {
        parsedContent = JSON.parse(cleanedContent);
      } catch (error) {
        console.error("JSON Parse Error:", error);
        console.error("Cleaned Content:", cleanedContent);
        throw new AI21Error("Invalid JSON response from AI", "INVALID_JSON");
      }

      // Validate required fields
      const requiredFields = [
        "title",
        "storyTitle",
        "storySynopsis",
        "storyTags",
        "content",
      ];
      const missingFields = requiredFields.filter(
        (field) => !(field in parsedContent) || !parsedContent[field]
      );

      if (missingFields.length > 0) {
        throw new AI21Error(
          `Missing required fields: ${missingFields.join(", ")}`,
          "MISSING_FIELDS"
        );
      }

      // Validate content field
      if (
        typeof parsedContent.content !== "string" ||
        parsedContent.content.trim().length < 100
      ) {
        throw new AI21Error(
          "Content field is invalid or too short",
          "INVALID_CONTENT"
        );
      }

      // Convert content to HTML
      const htmlContent = converter.makeHtml(parsedContent.content);

      // Save processed response
      const processedOutputPath = path.join(
        CONFIG.outputDir,
        `${response.id}.json`
      );
      try {
        fs.writeFileSync(
          processedOutputPath,
          JSON.stringify(
            {
              ...parsedContent,
              content: htmlContent,
              generatedAt: new Date().toISOString(),
            },
            null,
            2
          )
        );
      } catch (error) {
        console.warn("Failed to save processed response:", error);
      }

      return {
        ...parsedContent,
        content: htmlContent,
      };
    } catch (error) {
      retries++;
      console.error(`AI Generation attempt ${retries} failed:`, error);

      if (retries === CONFIG.maxRetries) {
        throw new AI21Error(
          `Failed to generate chapter after ${
            CONFIG.maxRetries
          } attempts. Last error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          "MAX_RETRIES_EXCEEDED"
        );
      }

      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * Math.pow(2, retries - 1))
      );
    }
  }
};

export default ai21;

export const chapterRouter = createTRPCRouter({
  createOrUpdate: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        wordCount: z.number(),
        readingTime: z.number(),
        status: z.nativeEnum(StoryStatus),
        storyId: z.string().nullable(),
        isLocked: z.boolean().optional(),
        price: z.nativeEnum(ChapterPricePool).nullable(),
        scheduledFor: z.date().optional(),
        edit: z.string().cuid().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.storyId) {
        throw new Error("Story ID is required");
      }

      try {
        // Get story details
        const story = await ctx.postgresDb.story.findUnique({
          where: { id: input.storyId },
          select: {
            chapterCount: true,
            slug: true,
            readingTime: true,
            authorId: true,
          },
        });

        if (!story) {
          throw new Error("Story not found");
        }

        // If editing, verify chapter exists and user has permission
        if (input.edit) {
          const existingChapter = await ctx.postgresDb.chapter.findUnique({
            where: { id: input.edit },
            select: {
              id: true,
              storyId: true,
              mongoContentID: true,
              chapterNumber: true,
              story: {
                select: {
                  authorId: true,
                },
              },
            },
          });

          if (!existingChapter) {
            throw new Error("Chapter not found");
          }

          // Verify author permissions
          if (existingChapter.story.authorId !== ctx.session?.user.id) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "You are not authorized to edit this chapter",
            });
          }

          // Process content into chunks
          const chunks = processChapterContent(input.content);
          const objectId = mongoObjectId();

          // Create new version in MongoDB
          const mongoContentID = await (await ctx.mongoDb.getDb())
            .collection(chapterCollectionName)
            .insertOne({
              id: objectId,
              storyId: input.storyId,
              chapterNumber: existingChapter.chapterNumber,
              version: existingChapter.mongoContentID.length + 1,
              createdAt: new Date(),
            });

          // First insert new chunks
          await (await ctx.mongoDb.getDb())
            .collection(chunkCollectionName)
            .insertMany(
              chunks.map((chunk, index) => ({
                chapterId: mongoContentID.insertedId.toString(),
                content: chunk.content,
                index: index,
              }))
            );

          // Then update PostgreSQL to point to new content
          await ctx.postgresDb.chapter.update({
            where: { id: input.edit },
            data: {
              title: input.title,
              slug: makeSlug(input.title),
              metrics: JSON.stringify({
                ...METRICS_DEFAULT_VALUES,
                wordCount: input.wordCount,
                readingTime: input.readingTime,
              }),
              isLocked: input.isLocked,
              price: input.price,
              scheduledFor: input.scheduledFor,
              mongoContentID: [mongoContentID.insertedId.toString()], // Only keep latest version
              updatedAt: new Date(),
            },
          });

          // Finally delete old chunks
          await (await ctx.mongoDb.getDb())
            .collection(chunkCollectionName)
            .deleteMany({
              chapterId: existingChapter.mongoContentID[0],
            });

          // Update story metadata
          await ctx.postgresDb.story.update({
            where: { id: input.storyId },
            data: {
              readingTime: input.readingTime,
            },
          });

          return {
            success: true,
            message: "Chapter updated successfully",
            storySlug: story.slug,
          };
        }

        // Create new chapter
        const chunks = processChapterContent(input.content);
        const objectId = mongoObjectId();

        // Create new chapter in MongoDB
        const mongoContentID = await (await ctx.mongoDb.getDb())
          .collection(chapterCollectionName)
          .insertOne({
            id: objectId,
            storyId: input.storyId,
            chapterNumber: story.chapterCount + 1,
            version: 1,
            createdAt: new Date(),
          });

        // Insert chunks in a transaction
        await (await ctx.mongoDb.getDb())
          .collection(chunkCollectionName)
          .insertMany(
            chunks.map((chunk, index) => ({
              chapterId: mongoContentID.insertedId.toString(),
              content: chunk.content,
              index: index,
            }))
          );

        // Create PostgreSQL chapter
        await ctx.postgresDb.chapter.create({
          data: {
            title: input.title,
            chapterNumber: story.chapterCount + 1,
            slug: makeSlug(input.title),
            storyId: input.storyId,
            metrics: JSON.stringify({
              ...METRICS_DEFAULT_VALUES,
              wordCount: input.wordCount,
              readingTime: input.readingTime,
            }),
            isLocked: input.isLocked,
            price: input.price,
            scheduledFor: input.scheduledFor,
            mongoContentID: [mongoContentID.insertedId.toString()],
          },
        });

        // Update story metadata
        await ctx.postgresDb.story.update({
          where: { id: input.storyId },
          data: {
            chapterCount: story.chapterCount + 1,
            readingTime: story.readingTime + input.readingTime,
            storyStatus:
              story.chapterCount === 0 ? StoryStatus.PUBLISHED : undefined,
          },
        });

        return {
          success: true,
          message: "Chapter published successfully",
          storySlug: story.slug,
        };
      } catch (error) {
        console.error(error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new Error("Failed to create/update chapter");
      }
    }),

  updateChapterOrder: protectedProcedure
    .input(
      z.object({
        storyId: z.string(),
        chapterIdsAndOrders: z.array(
          z.object({
            chapterId: z.string(),
            order: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { storyId, chapterIdsAndOrders } = input;
      try {
        const story = await ctx.postgresDb.story.findUnique({
          where: { id: storyId },
        });

        if (!story) {
          throw new Error("Story not found");
        }

        await Promise.all(
          chapterIdsAndOrders.map(({ chapterId, order }) =>
            ctx.postgresDb.chapter.update({
              where: { id: chapterId },
              data: { chapterNumber: order },
            })
          )
        );

        return {
          success: true,
          message: "Chapter order updated successfully",
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to update chapter order");
      }
    }),

  getChapterDetailsBySlugOrId: publicProcedure
    .input(z.object({ slugOrId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { slugOrId } = input;

      try {
        const chapter = await ctx.postgresDb.chapter.findFirst({
          where: {
            slug: cuidRegex.test(slugOrId) ? undefined : slugOrId,
            id: cuidRegex.test(slugOrId) ? slugOrId : undefined,
          },
          include: {
            story: {
              select: {
                id: true,
                title: true,
                ratingCount: true,
                averageRating: true,

                slug: true,
                author: {
                  select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                  },
                },
                chapters: {
                  select: {
                    id: true,
                    title: true,
                    slug: true,
                    chapterNumber: true,
                    isLocked: true,
                    price: true,
                    scheduledFor: true,
                  },
                  orderBy: {
                    chapterNumber: "asc",
                  },
                },
                chapterCount: true,
                thumbnail: true,
              },
            },
          },
        });

        if (!chapter) {
          throw new Error("Chapter not found");
        }

        const { story, ...rest } = chapter;

        // Get the initial chunk with proper typing
        const initialChunk = await (await ctx.mongoDb.getDb())
          .collection(chunkCollectionName)
          .findOne(
            { chapterId: chapter.mongoContentID[0], index: 0 },
            { projection: { _id: 1, content: 1, index: 1 } }
          );

        if (!initialChunk) {
          throw new Error("Chapter content not found");
        }

        return {
          chapter: rest,
          story,
          initialChunk: {
            id: initialChunk._id.toString(),
            content: initialChunk.content as string,
            index: initialChunk.index as number,
          },
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to get chapter details");
      }
    }),

  getChapterChunks: publicProcedure
    .input(
      z.object({
        chapterId: z.string(),
        limit: z.number().min(1).max(2).default(2),
        cursor: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { chapterId, limit, cursor } = input;
      try {
        const query = {
          chapterId,
          index: { $gt: cursor ?? 0, $ne: 0 },
        };

        const chunks = await (
          await ctx.mongoDb.getDb()
        )
          .collection(chunkCollectionName)
          .find(query)
          .sort({ index: 1 })
          .limit(limit + 1)
          .toArray();

        let nextCursor: number | undefined = undefined;
        if (chunks.length > limit) {
          const lastChunk = chunks[limit - 1];
          nextCursor = lastChunk?.index ?? undefined;
          chunks.pop();
        }

        return {
          chunks: chunks.map((chunk) => ({
            id: chunk._id.toString(),
            content: chunk.content,
            index: chunk.index,
          })),
          nextCursor,
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to get chapter chunks");
      }
    }),

  getChunkLength: publicProcedure
    .input(
      z.object({
        chapter_id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { chapter_id } = input;

      try {
        const chunk = await (await ctx.mongoDb.getDb())
          .collection(chunkCollectionName)
          .findOne(
            {
              chapterId: chapter_id,
            },
            {
              sort: { index: 1 },
            }
          );

        return {
          chunk,
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to get chunk length");
      }
    }),

  increaseReadCount: publicProcedure
    .input(
      z.object({
        chapterId: z.string(),
        anonymous: z.string().cuid2().optional(),
        city: z.string().nullable(),
        ip: z.string().nullable(),
        ref: z.string().nullable(),
        readTime: z.number().nullable(),
        searchQuery: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id ?? (input.anonymous as string);

      const chapterId = input.chapterId;
      try {
        const [chapter, hasViewed] = await ctx.postgresDb.$transaction([
          ctx.postgresDb.chapter.findUnique({
            where: { id: chapterId },
            include: { story: true },
          }),
          ctx.postgresDb.readEvent.findFirst({
            where: { readerKey: userId, chapterId },
          }),
        ]);

        if (!chapter) {
          return { success: false };
        }

        const now = new Date();
        const lastRead = hasViewed?.updatedAt
          ? new Date(hasViewed.updatedAt)
          : null;
        const elapsedMs = lastRead
          ? now.getTime() - lastRead.getTime()
          : undefined;
        const hoursSinceLastRead = elapsedMs
          ? elapsedMs / (1000 * 60 * 60)
          : 24;
        const minutesSinceLastRead = elapsedMs ? elapsedMs / (1000 * 60) : 5;

        // First time: create event and increment story reads
        if (!hasViewed) {
          await ctx.postgresDb.$transaction([
            ctx.postgresDb.readEvent.create({
              data: {
                readerKey: userId,
                userId: ctx.session?.user.id ?? undefined,
                chapterId: chapter.id,
                ipAddress: input.ip ?? null,
                readTime: input.readTime ?? 0,
                trafficSource: input.ref?.startsWith("feed:")
                  ? "FEED"
                  : input.ref?.startsWith("search")
                  ? "SEARCH"
                  : input.ref === ""
                  ? "DIRECT"
                  : "REFERRAL",
                searchQuery: input.searchQuery ?? "",
                referrerUrl: input.ref ?? null,
                city: input.city ?? null,
                frequency: 1,
              },
            }),
            ctx.postgresDb.story.update({
              where: { id: chapter.storyId },
              data: { readCount: { increment: 1 } },
            }),
          ]);

          return {
            success: true,
            message: "Read count increased successfully",
          };
        }

        // Throttle frequency to every 5 minutes
        if (minutesSinceLastRead >= 5) {
          await ctx.postgresDb.readEvent.update({
            where: {
              readerKey_chapterId: {
                readerKey: userId,
                chapterId: chapter.id,
              },
            },
            data: {
              updatedAt: new Date(),
              frequency: { increment: 1 },
              // Refresh mutable context fields when provided
              ipAddress: input.ip ?? undefined,
              city: input.city ?? undefined,
              userId: ctx.session?.user.id ?? undefined,
            },
          });
        }

        // Only increment story reads once per 24 hours per user
        if (hoursSinceLastRead >= 24) {
          await ctx.postgresDb.story.update({
            where: { id: chapter.storyId },
            data: { readCount: { increment: 1 } },
          });
        }

        return {
          success: true,
          message: "Read count increased successfully",
        };
      } catch (err) {
        console.error(err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to increase read count",
        });
      }
    }),

  unlock: protectedProcedure
    .input(z.object({ chapterId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { chapterId } = input;

      const { user } = ctx.session;

      try {
        if (!user) {
          throw new Error("User not found");
        }

        const chapter = await ctx.postgresDb.chapter.findUnique({
          where: { id: chapterId },
          select: {
            price: true,
            unlockedUsers: {
              where: {
                userId: user.id,
              },
            },
          },
        });

        if (!chapter) {
          throw new Error("Chapter not found");
        }

        if (chapter.price === null) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Chapter is free",
          });
        }

        const basePrice = CHAPTER_PRICE_POOL[chapter.price];
        const requiredCoins = user.premium
          ? Math.floor(basePrice * 0.8) // 20% discount for premium users
          : basePrice;

        if (user.coins < requiredCoins) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Insufficient balance to unlock chapter",
          });
        }

        if (chapter.unlockedUsers.length > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Chapter is already unlocked",
          });
        }

        await Promise.all([
          ctx.postgresDb.unlockedChapter.create({
            data: {
              userId: user.id,
              chapterId,
              price: chapter.price,
            },
          }),
          ctx.postgresDb.user.update({
            where: { id: user.id },
            data: {
              coins: {
                decrement: requiredCoins,
              },
            },
          }),
        ]);

        return {
          success: true,
          message: "Chapter unlocked successfully",
        };
      } catch (err) {
        console.error(err);
        if (err instanceof TRPCError) {
          throw err;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to unlock chapter",
        });
      }
    }),

  getUserUnlockedChapter: publicProcedure
    .input(z.object({ chapterId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { chapterId } = input;

      const user = ctx.session?.user;

      if (!user) {
        return false;
      }

      const hasUnlockedChapter = await ctx.postgresDb.unlockedChapter.findFirst(
        {
          where: {
            userId: user.id,
            chapterId,
          },
        }
      );

      if (!hasUnlockedChapter) {
        return false;
      }

      return true;
    }),

  getDataForEdit: protectedProcedure
    .input(
      z.object({
        chapter_id: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const chapter = await ctx.postgresDb.chapter.findFirst({
          where: {
            id: input.chapter_id,
          },
          select: {
            story: {
              select: {
                authorId: true,
                id: true,
                chapters: {
                  select: {
                    id: true,
                  },
                },
              },
            },
            title: true,
            scheduledFor: true,
            isLocked: true,
            mongoContentID: true,
            price: true,
            metrics: true,
            chapterNumber: true,
          },
        });

        if (!chapter) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Chapter not found",
          });
        }

        if (chapter.story.authorId !== ctx.session.user.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not authorized to edit this chapter",
          });
        }

        const db = await ctx.mongoDb.getDb();

        // Get all chunks for the chapter
        const chunks = await Promise.all(
          chapter.mongoContentID.map(async (contentId) =>
            db
              .collection(chunkCollectionName)
              .find({ chapterId: contentId })
              .sort({ index: 1 }) // Ensure chunks are in order
              .toArray()
          )
        );

        // Serialize the MongoDB data and ensure proper structure
        const serializedChunks = chunks.map((chunkArray) =>
          chunkArray.map((chunk) => ({
            id: chunk._id.toString(),
            content: chunk.content,
            index: chunk.index,
            chapterId: chunk.chapterId.toString(),
          }))
        );

        return {
          story: chapter.story,
          title: chapter.title,
          scheduledFor: chapter.scheduledFor,
          isLocked: chapter.isLocked,
          price: chapter.price,
          metrics: chapter.metrics,
          chapterNumber: chapter.chapterNumber,
          content: serializedChunks,
        };
      } catch (err) {
        console.error(err);
        if (err instanceof TRPCError) {
          throw err;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get chapter data for edit",
        });
      }
    }),
});

export type getChapterDetailsBySlugOrIdResponse = inferProcedureOutput<
  typeof chapterRouter.getChapterDetailsBySlugOrId
>;

export type getDataForEditResponse = inferProcedureOutput<
  typeof chapterRouter.getDataForEdit
>;

const MAX_CHUNK_SIZE = 1500 as const;

interface ContentChunk {
  content: string;
  wordCount: number;
  index: number;
}

function countWords(html: string): number {
  // Remove HTML tags and count words
  const text = html.replace(/<[^>]*>/g, " ");
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

export function processChapterContent(content: string): ContentChunk[] {
  // Ensure content has proper paragraph structure
  let processedContent = content;

  // If content doesn't have paragraph tags, wrap it
  if (!processedContent.includes("<p>")) {
    // Split by double newlines or single newlines and wrap in paragraphs
    const paragraphs = processedContent
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0)
      .map((p) => `<p>${p}</p>`);

    processedContent = paragraphs.join("\n");
  }

  // Split content into paragraphs
  const paragraphs = processedContent
    .split("</p>")
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
    .map((p) => p + "</p>");

  const chunks: ContentChunk[] = [];
  let currentChunk: string[] = [];
  let currentWordCount = 0;
  let chunkIndex = 0;

  for (const paragraph of paragraphs) {
    const paragraphWordCount = countWords(paragraph);

    // If adding this paragraph would exceed MAX_CHUNK_SIZE
    // and we already have some content in currentChunk
    if (
      currentWordCount + paragraphWordCount > MAX_CHUNK_SIZE &&
      currentChunk.length > 0
    ) {
      chunks.push({
        content: currentChunk.join("\n"),
        wordCount: currentWordCount,
        index: chunkIndex++,
      });

      // Reset for new chunk
      currentChunk = [];
      currentWordCount = 0;
    }

    currentChunk.push(paragraph);
    currentWordCount += paragraphWordCount;
  }

  // Add remaining content as final chunk
  if (currentChunk.length > 0) {
    chunks.push({
      content: currentChunk.join("\n"),
      wordCount: currentWordCount,
      index: chunkIndex,
    });
  }

  return chunks;
}
