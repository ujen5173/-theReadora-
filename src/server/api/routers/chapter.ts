import { StoryStatus } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { makeSlug, mongoObjectId } from "~/utils/helpers";

export const chapterRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        wordCount: z.number(),
        readingTime: z.number(),
        status: z.nativeEnum(StoryStatus),
        storyId: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.storyId) {
        throw new Error("Story ID is required");
      }
      try {
        //? how we are going to handle the chapter creation?
        // we need to find a way to break down the content into chunks based on the word count
        //? how are we going to break down the paragraphs and break them into chunks?
        //? after the chunks are created, we need to save them to the database, but how?
        // we would be using mongodb for the storage of the chunks
        // but but but, i think we need to store the html content or the JSONContent in the postgresql database too.
        // why? because we need to get the chapter content when user is going to edit the chapter.
        // again the problem arises, how are we going to edit the chapter?

        const story = await ctx.postgresDb.story.findUnique({
          where: {
            id: input.storyId,
          },
          select: {
            chapterCount: true,
            slug: true,
            readingTime: true,
          },
        });

        if (!story) {
          throw new Error("Story not found");
        }

        const chunks = processChapterContent(input.content);

        const objectId = mongoObjectId();

        const mongoContentID = await ctx.mongoDb.chapter.create({
          data: {
            id: objectId,
            storyId: input.storyId,
            chapterNumber: story.chapterCount + 1,
            version: 1,
            chunks: {
              create: chunks.map((chunk, index) => ({
                content: chunk.content,
                index: index,
              })),
            },
          },
        });

        await ctx.postgresDb.chapter.create({
          data: {
            title: input.title,
            chapterNumber: story.chapterCount + 1,
            slug: makeSlug(input.title),
            storyId: input.storyId,
            metrics: JSON.stringify({
              wordCount: input.wordCount,
              readingTime: input.readingTime,
              likesCount: 0,
              commentsCount: 0,
              viewsCount: 0,
              sharesCount: 0,
              ratingCount: 0,
              ratingValue: 0,
              ratingAvg: 0,
            }),
            mongoContentID: [mongoContentID.id],
          },
        });

        await ctx.postgresDb.story.update({
          where: { id: input.storyId },
          data: {
            chapterCount: story.chapterCount + 1,
            readingTime: story.readingTime + input.readingTime,
          },
        });

        // update the story status if the chapter is the first chapter
        if (story.chapterCount === 0) {
          await ctx.postgresDb.story.update({
            where: { id: input.storyId },
            data: { storyStatus: StoryStatus.PUBLISHED },
          });
        }

        return {
          success: true,
          message: "Chapter created successfully",

          storySlug: story.slug,
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to create chapter");
      }
    }),
});

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

function processChapterContent(content: string): ContentChunk[] {
  // Split content into paragraphs (assuming paragraphs are separated by </p>)
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
      // Store current chunk
      chunks.push({
        content: currentChunk.join("\n"),
        wordCount: currentWordCount,
        index: chunkIndex++,
      });

      // Reset for new chunk
      currentChunk = [];
      currentWordCount = 0;
    }

    // Add paragraph to current chunk
    currentChunk.push(paragraph);
    currentWordCount += paragraphWordCount;
  }

  // Don't forget to add the last chunk if there's anything left
  if (currentChunk.length > 0) {
    chunks.push({
      content: currentChunk.join("\n"),
      wordCount: currentWordCount,
      index: chunkIndex,
    });
  }

  return chunks;
}
