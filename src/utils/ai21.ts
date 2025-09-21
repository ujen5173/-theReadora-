import { AI21 } from "ai21";
import fs from "fs";
import path from "path";
import showdown from "showdown";

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
      // Check if API key is available
      if (!process.env.AI21_API_KEY) {
        throw new AI21Error(
          "AI21_API_KEY environment variable is not set",
          "NO_API_KEY"
        );
      }

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

      // Try different API endpoints and models
      let response;
      try {
        // First try the chat completions endpoint with jamba-instruct
        response = await ai21.chat.completions.create({
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.8,
          max_tokens: 4000,
          model: "jamba-mini",
        });
      } catch (chatError) {
        console.warn(
          "Chat completions failed, trying completions endpoint:",
          chatError
        );

        // Fallback to the completions endpoint
        response = await ai21.chat.completions.create({
          temperature: 0.8,
          max_tokens: 4000,
          model: "jamba-mini",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        });
      }

      const content =
        response.choices?.[0]?.message?.content || response.choices?.[0]?.text;

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
        `${responseId}.json`
      );
      try {
        fs.writeFileSync(
          processedOutputPath,
          JSON.stringify(
            {
              ...parsedContent,
              content: htmlContent,
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
