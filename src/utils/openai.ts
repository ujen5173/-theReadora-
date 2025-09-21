import fs from "fs";
import OpenAI from "openai";
import path from "path";
import { cwd } from "process";
import showdown from "showdown";
import { THUMBNAILS } from "~/data/thumbnails";
import { env } from "~/env";
import { getMongoDB } from "~/server/mongodb";
import { postgresDb as db } from "~/server/postgresql";
import { siteConfig } from "./site";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": siteConfig.name,
  },
});

// Custom error types
class OpenAIError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "OpenAIError";
  }
}

// Configuration
const CONFIG = {
  outputDir: path.resolve(cwd(), "ai-generated"),
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

export const generateStory = async (
  genre: string,
  chapterCount: number = 5
) => {
  let retries = 0;

  while (retries < CONFIG.maxRetries) {
    try {
      // Check if API key is available
      if (!env.OPENROUTER_API_KEY) {
        throw new OpenAIError(
          "OPENROUTER_API_KEY environment variable is not set",
          "NO_API_KEY"
        );
      }

      const prompt = `You are a skilled fiction author specializing in ${genre} stories. Create a complete story with ${chapterCount} chapters.

        **Output Format**
        Return a valid JSON object with these exact fields:
        {
          "title": "Story title (max 6 words)",
          "synopsis": "2-3 paragraph synopsis (150-200 words total)",
          "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
          "isMature": false,
          "isLGBTQContent": false,
          "language": "English",
          "chapters": [
            {
              "chapterNumber": 1,
              "title": "Chapter title (max 6 words)",
              "content": "Chapter content in Markdown format (minimum 1000 words, target 2000 words per chapter)"
            }
          ]
        }

        **Writing Guidelines**
        - Write in third person perspective
        - Use vivid, sensory descriptions
        - Include natural dialogue
        - Build tension and intrigue throughout
        - Maintain consistent tone and voice
        - Keep content PG-13 appropriate unless specified otherwise
        - Avoid AI-generated clichés
        - Create compelling characters with clear arcs
        - Ensure each chapter has a clear purpose and advances the plot
        - End with a satisfying conclusion

        **Content Requirements**
        - Each chapter should be approximately 2000 words (minimum 1000 words per chapter)
        - Use proper paragraph breaks and dialogue formatting
        - Include character development and plot progression
        - Create engaging cliffhangers between chapters
        - Make it feel like a professional published work
        - Ensure the story has a clear beginning, middle, and end
        - Each chapter must be substantial and meaningful to the overall story
        - Avoid placeholder text or incomplete content

        **JSON Requirements**
        - Must be valid JSON that parses without errors
        - No extra text before or after the JSON
        - All strings must be properly escaped (use \\ for backslashes, \" for quotes)
        - Use double quotes for all keys and string values
        - Chapter numbers should start from 1 and be sequential
        - No trailing commas in objects or arrays
        - Ensure all brackets and braces are properly closed
        - Test your JSON before submitting - it must be parseable

        **Genre-Specific Guidelines**
        - For ${genre}: Focus on genre-specific tropes, themes, and conventions
        - Create appropriate atmosphere and mood
        - Include genre-typical character types and conflicts
        - Use genre-appropriate pacing and structure

        **Critical Requirements**
        - EVERY chapter must have substantial content (minimum 1000 words)
        - Do not use placeholder text like "Chapter content goes here" or "To be continued"
        - Each chapter should be a complete, meaningful part of the story
        - Ensure all chapters are properly numbered starting from 1
        - Make sure the JSON is valid and complete

        Generate the complete story JSON object now:`;

      const response = await openai.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a professional JSON generator. Always return valid, properly formatted JSON. Pay special attention to escaping quotes and backslashes in strings. Never include trailing commas. Test your JSON before returning it.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7, // Slightly lower temperature for more consistent output
      });

      const content = response.choices?.[0]?.message?.content;

      if (!content) {
        throw new OpenAIError("No content generated from AI", "NO_CONTENT");
      }

      // Ensure output directory exists
      try {
        if (!fs.existsSync(CONFIG.outputDir)) {
          fs.mkdirSync(CONFIG.outputDir, { recursive: true });
        }
      } catch (error) {
        throw new OpenAIError(`Failed to create output directory`, "FS_ERROR");
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
      const responseId = response.id || `response-${Date.now()}`;
      const rawOutputPath = path.join(
        CONFIG.outputDir,
        `${responseId}-raw.json`
      );
      try {
        fs.writeFileSync(
          rawOutputPath,
          JSON.stringify(
            {
              content: content,
              generatedAt: new Date().toISOString(),
              responseId: responseId,
            },
            null,
            2
          )
        );
      } catch (error) {
        console.warn("Failed to save raw response:", error);
      }

      // Clean and parse content
      let cleanedContent = content
        .replace(/```json\s*/g, "")
        .replace(/```\s*$/g, "")
        .replace(/^```\s*/g, "")
        .trim();

      // Try to extract JSON from the content if it's wrapped in other text
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedContent = jsonMatch[0];
        console.log("Extracted JSON from wrapped content");
      }

      // If still no JSON found, try to find it between specific markers
      if (!cleanedContent.startsWith("{")) {
        const startIndex = cleanedContent.indexOf("{");
        const lastIndex = cleanedContent.lastIndexOf("}");
        if (startIndex !== -1 && lastIndex !== -1 && lastIndex > startIndex) {
          cleanedContent = cleanedContent.substring(startIndex, lastIndex + 1);
          console.log("Extracted JSON between braces");
        }
      }

      // Debug: Log the cleaned content length
      console.log(
        `Cleaned content length: ${cleanedContent.length} characters`
      );

      let parsedContent;
      try {
        parsedContent = JSON.parse(cleanedContent);
        console.log(
          `Successfully parsed JSON with ${
            parsedContent.chapters?.length || 0
          } chapters`
        );
      } catch (error) {
        console.error("JSON Parse Error:", error);
        console.error(
          "Cleaned Content (first 1000 chars):",
          cleanedContent.substring(0, 1000)
        );
        console.error(
          "Cleaned Content (last 1000 chars):",
          cleanedContent.substring(Math.max(0, cleanedContent.length - 1000))
        );

        // Try to fix common JSON issues
        let fixedContent = cleanedContent;

        // Fix common JSON issues
        fixedContent = fixedContent
          .replace(/,(\s*[}\]])/g, "$1") // Remove trailing commas
          .replace(/([{\[,])\s*(\s*[}\]])/g, "$1$2") // Fix empty objects/arrays
          .replace(/([^\\])\\([^"\\\/bfnrt])/g, "$1\\\\$2") // Fix unescaped backslashes
          .replace(/([^\\])\\([^"\\\/bfnrt])/g, "$1\\\\$2"); // Fix again for double escapes

        try {
          parsedContent = JSON.parse(fixedContent);
          console.log("Successfully parsed JSON after fixing common issues");
        } catch (secondError) {
          console.error("JSON still invalid after fixes:", secondError);

          // Last resort: try to create a minimal valid structure
          console.log("Attempting to create minimal valid structure...");
          try {
            parsedContent = {
              title: "Generated Story",
              synopsis: "An AI-generated story",
              tags: ["AI Generated"],
              isMature: false,
              isLGBTQContent: false,
              language: "English",
              chapters: [
                {
                  chapterNumber: 1,
                  title: "Chapter 1",
                  content:
                    "This is a placeholder chapter. The AI-generated content could not be parsed properly.",
                },
              ],
            };
            console.log("Created minimal fallback structure");
          } catch (fallbackError) {
            console.error("Even fallback structure failed:", fallbackError);
            throw new OpenAIError(
              "Invalid JSON response from AI - unable to parse even after fixes and fallback",
              "INVALID_JSON"
            );
          }
        }
      }

      // Validate required fields
      const requiredFields = ["title", "synopsis", "tags", "chapters"];
      const missingFields = requiredFields.filter(
        (field) => !(field in parsedContent) || !parsedContent[field]
      );

      if (missingFields.length > 0) {
        throw new OpenAIError(
          `Missing required fields: ${missingFields.join(", ")}`,
          "MISSING_FIELDS"
        );
      }

      // Validate chapters
      if (
        !Array.isArray(parsedContent.chapters) ||
        parsedContent.chapters.length === 0
      ) {
        throw new OpenAIError(
          "Chapters field must be a non-empty array",
          "INVALID_CHAPTERS"
        );
      }

      // Validate each chapter
      const shortChapters: number[] = [];
      for (let i = 0; i < parsedContent.chapters.length; i++) {
        const chapter = parsedContent.chapters[i];
        if (!chapter.title || !chapter.content) {
          throw new OpenAIError(
            `Chapter ${i + 1} is missing title or content`,
            "INVALID_CHAPTER"
          );
        }

        const contentLength = chapter.content.trim().length;
        if (typeof chapter.content !== "string" || contentLength < 50) {
          console.warn(
            `Chapter ${i + 1} content is short (${contentLength} characters):`,
            chapter.content.substring(0, 100) + "..."
          );
          shortChapters.push(i + 1);
        }

        // Log chapter lengths for debugging
        console.log(`Chapter ${i + 1}: ${contentLength} characters`);
      }

      // If we have short chapters, throw an error but provide more context
      if (shortChapters.length > 0) {
        throw new OpenAIError(
          `Chapters ${shortChapters.join(
            ", "
          )} have insufficient content. Expected at least 50 characters per chapter.`,
          "INVALID_CHAPTER_CONTENT"
        );
      }

      // Convert chapter content to HTML
      const processedChapters = parsedContent.chapters.map((chapter: any) => ({
        ...chapter,
        content: converter.makeHtml(chapter.content),
      }));

      // Set defaults for optional fields
      const processedContent = {
        ...parsedContent,
        chapters: processedChapters,
        isMature: parsedContent.isMature || false,
        isLGBTQContent: parsedContent.isLGBTQContent || false,
        language: parsedContent.language || "English",
      };

      // Save processed response
      const processedOutputPath = path.join(
        CONFIG.outputDir,
        `${responseId}.json`
      );
      try {
        fs.writeFileSync(
          processedOutputPath,
          JSON.stringify(
            {
              ...processedContent,
              generatedAt: new Date().toISOString(),
              responseId: responseId,
            },
            null,
            2
          )
        );
      } catch (error) {
        console.warn("Failed to save processed response:", error);
      }

      return processedContent;
    } catch (error) {
      retries++;
      console.error(`AI Generation attempt ${retries} failed:`, error);

      if (retries === CONFIG.maxRetries) {
        throw new OpenAIError(
          `Failed to generate story after ${
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

export const saveGeneratedStoryToDatabase = async (
  generatedStory: any,
  authorId: string,
  genreSlug: string
) => {
  try {
    // Calculate reading time (assuming 200 words per minute)
    const totalWordCount = generatedStory.chapters.reduce(
      (total: number, chapter: any) => {
        const wordCount = chapter.content
          .replace(/<[^>]*>/g, "")
          .split(/\s+/).length;
        return total + wordCount;
      },
      0
    );
    const readingTime = Math.ceil(totalWordCount / 200); // minutes

    // Create story slug
    const storySlug = generatedStory.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();

    // Create the story
    const story = await db.story.create({
      data: {
        title: generatedStory.title,
        slug: storySlug,
        synopsis: generatedStory.synopsis,
        readingTime: readingTime,
        thumbnail: THUMBNAILS[Math.floor(Math.random() * THUMBNAILS.length)]!, // You might want to generate this
        thumbnailId: "default",
        tags: generatedStory.tags,
        isMature: generatedStory.isMature || false,
        isLGBTQContent: generatedStory.isLGBTQContent || false,
        language: generatedStory.language || "English",
        hasAiContent: true,
        isCompleted: true,
        storyStatus: "DRAFT",
        authorId: authorId,
        genreSlug: genreSlug,
        chapterCount: generatedStory.chapters.length,
      },
    });

    // Get MongoDB connection
    const mongoDb = await getMongoDB();
    const mongoContentIds: string[] = [];

    // Create chapters and store content in MongoDB
    const chapters = await Promise.all(
      generatedStory.chapters.map(async (chapter: any, index: number) => {
        const chapterSlug = chapter.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .trim();

        // Store content in MongoDB
        const mongoContent = await mongoDb.collection("chapters").insertOne({
          content: chapter.content,
          storyId: story.id,
          chapterNumber: chapter.chapterNumber || index + 1,
          createdAt: new Date(),
        });

        mongoContentIds.push(mongoContent.insertedId.toString());

        return db.chapter.create({
          data: {
            chapterNumber: chapter.chapterNumber || index + 1,
            title: chapter.title,
            slug: chapterSlug,
            storyId: story.id,
            metrics: {
              wordCount: chapter.content.replace(/<[^>]*>/g, "").split(/\s+/)
                .length,
              readingTime: Math.ceil(
                chapter.content.replace(/<[^>]*>/g, "").split(/\s+/).length /
                  200
              ),
              likesCount: 0,
              commentsCount: 0,
              ratingCount: 0,
              ratingValue: 0,
              averageRating: 0,
            },
            readershipAnalytics: {
              total: 0,
              unique: 0,
            },
            mongoContentID: [mongoContent.insertedId.toString()],
            isLocked: false,
          },
        });
      })
    );

    return {
      story,
      chapters,
      mongoContentIds,
    };
  } catch (error) {
    console.error("Error saving story to database:", error);
    throw new OpenAIError(
      `Failed to save story to database: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      "DATABASE_ERROR"
    );
  }
};
