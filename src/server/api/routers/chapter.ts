import { ChapterPricePool, StoryStatus } from "@prisma/client";
import { TRPCError, type inferProcedureOutput } from "@trpc/server";
import { z } from "zod";
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
  READERSHIP_ANALYTICS_DEFAULT_VALUES,
} from "~/utils/constants";
import { makeSlug, mongoObjectId } from "~/utils/helpers";

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
          const mongoContentID = await ctx.mongoDb
            .collection(chapterCollectionName)
            .insertOne({
              id: objectId,
              storyId: input.storyId,
              chapterNumber: existingChapter.chapterNumber,
              version: existingChapter.mongoContentID.length + 1,
              createdAt: new Date(),
            });

          // First insert new chunks
          await ctx.mongoDb.collection(chunkCollectionName).insertMany(
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
          await ctx.mongoDb.collection(chunkCollectionName).deleteMany({
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
        const mongoContentID = await ctx.mongoDb
          .collection(chapterCollectionName)
          .insertOne({
            id: objectId,
            storyId: input.storyId,
            chapterNumber: story.chapterCount + 1,
            version: 1,
            createdAt: new Date(),
          });

        // Insert chunks in a transaction
        await ctx.mongoDb.collection(chunkCollectionName).insertMany(
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
        const initialChunk = await ctx.mongoDb
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

        const chunks = await ctx.mongoDb
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
        const chunk = await ctx.mongoDb.collection(chunkCollectionName).findOne(
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
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id ?? (input.anonymous as string); // Use anonymous ID if user is not logged in

      const chapterId = input.chapterId;

      try {
        const [chapter, hasViewed] = await Promise.all([
          ctx.postgresDb.chapter.findUnique({
            where: {
              id: chapterId,
            },
            include: {
              story: true,
            },
          }),
          ctx.postgresDb.chapterRead.findFirst({
            where: {
              readerKey: userId,
              chapterId,
            },
          }),
        ]);

        if (!chapter) {
          throw new Error("Chapter not found");
        }

        // Check if 24 hours have passed since last read
        const now = new Date();
        const lastRead = hasViewed?.lastRead;
        const hoursSinceLastRead = lastRead
          ? (now.getTime() - lastRead.getTime()) / (1000 * 60 * 60)
          : 24;

        if (hoursSinceLastRead < 24) {
          return {
            success: true,
            message:
              "Read count not increased - 24 hour cooldown period not elapsed",
          };
        }

        // Safely parse metrics and readershipAnalytics
        let metrics;
        let readershipAnalytics;

        try {
          metrics =
            typeof chapter.metrics === "string"
              ? JSON.parse(chapter.metrics)
              : chapter.metrics;

          readershipAnalytics =
            typeof chapter.readershipAnalytics === "string"
              ? JSON.parse(chapter.readershipAnalytics)
              : chapter.readershipAnalytics;
        } catch (e) {
          // If parsing fails, use default values
          metrics = METRICS_DEFAULT_VALUES;
          readershipAnalytics = READERSHIP_ANALYTICS_DEFAULT_VALUES;
        }

        // Update metrics and analytics
        metrics.viewsCount = (metrics.viewsCount || 0) + 1;
        readershipAnalytics.total = (readershipAnalytics.total || 0) + 1;

        // Whether this is a new unique reader for this chapter
        const isNewUniqueRead = !hasViewed;

        if (isNewUniqueRead) {
          readershipAnalytics.unique = (readershipAnalytics.unique || 0) + 1;
        }

        // Update chapter and read record
        await Promise.all([
          ctx.postgresDb.chapter.update({
            where: {
              id: chapterId,
            },
            data: {
              metrics: metrics,
              readershipAnalytics: readershipAnalytics,
            },
          }),
          ctx.postgresDb.chapterRead.upsert({
            where: {
              chapterId_readerKey: {
                chapterId,
                readerKey: userId,
              },
            },
            create: {
              chapterId,
              readerKey: userId,
              lastRead: new Date(),
              frequency: 1,
            },
            update: {
              lastRead: new Date(),
              frequency: {
                increment: 1,
              },
            },
          }),
        ]);

        // If this is a new unique read, also update the story's readCount
        if (isNewUniqueRead) {
          await ctx.postgresDb.story.update({
            where: {
              id: chapter.storyId,
            },
            data: {
              readCount: {
                increment: 1,
              },
            },
          });
        }

        return {
          success: true,
          message: "Read count increased successfully",
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to increase read count");
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

        // Get all chunks for the chapter
        const chunks = await Promise.all(
          chapter.mongoContentID.map((contentId) =>
            ctx.mongoDb
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
  // Split content into paragraphs
  const paragraphs = content
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

  if (currentChunk.length > 0) {
    chunks.push({
      content: currentChunk.join("\n"),
      wordCount: currentWordCount,
      index: chunkIndex,
    });
  }

  return chunks;
}
