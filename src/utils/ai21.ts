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
      const prompt = `
        You are a skilled fiction author specializing in ${genre} stories.
        Create an engaging first chapter for a new story.

        **Branching Output**  
        The output will be a JSON object with the following fields:
        {
          "title": "…",                   // ≤6 words
          "storyTitle": "…",              // ≤6 words
          "storySynopsis": "…",           // 2–3 paragraphs, ~150–200 words total
          "storyTags": ["…","…","…","…","…"],
          "content": "…",                 // ~2000 words, in Markdown; escape all internal quotes
        }

        **JSON Validity**  
        - Single top‑level object, no extra text or formatting  
        - Double‑quoted keys and string values  
        - Booleans unquoted  
        - Must parse with JSON.parse() without error

        **Writing Guidelines**  
        1. Vivid, sensory descriptions  
        2. Natural, flowing dialogue  
        3. Show emotions via actions/reactions  
        4. Build tension and intrigue  
        5. Engaging but unrushed pacing  
        6. Consistent tone, PG‑13 appropriate  
        7. Feels authentic—no "AI‑generated" clichés

        Generate exactly the JSON object as specified.`;

      const response = await ai21.chat.completions.create({
        prompt,
        temperature: 0.7,
        max_tokens: 4096,
        topP: 0.9,
        stopSequences: ["}"],
        model: "jamba-mini-1.6-2025-03",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const content = response.choices[0]?.message.content;

      if (!content) {
        throw new AI21Error("No content generated from AI", "NO_CONTENT");
      }

      try {
        if (!fs.existsSync(CONFIG.outputDir)) {
          fs.mkdirSync(CONFIG.outputDir, { recursive: true });
        }
      } catch (error) {
        throw new AI21Error(`Failed to create output directory`, "FS_ERROR");
      }

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

      // Clean and validate content
      const cleanedContent = content
        .replace(/```json\s*/g, "")
        .replace(/```\s*$/g, "")
        .trim();

      // First, find the content field and properly escape its contents
      const contentMatch = cleanedContent.match(
        /"content":\s*"((?:[^"\\]|\\.)*)"/
      );
      if (!contentMatch) {
        throw new AI21Error(
          "Could not find content field in response",
          "INVALID_CONTENT"
        );
      }

      // Get the raw content and escape it properly
      const rawContent = contentMatch[1];
      const escapedContent = rawContent
        ?.replace(/\\/g, "\\\\") // backslashes
        .replace(/"/g, '\\"') // quotes
        .replace(/\n/g, "\\n") // newlines
        .replace(/\r/g, "\\r") // carriage returns
        .replace(/\t/g, "\\t"); // tabs

      const fixedContent = cleanedContent.replace(
        /"content":\s*"((?:[^"\\]|\\.)*)"/,
        `"content": "${escapedContent}"`
      );

      let parsedContent;
      try {
        parsedContent = JSON.parse(fixedContent);
      } catch (error) {
        throw new AI21Error("Invalid JSON response from AI", "INVALID_JSON");
      }

      const requiredFields = ["content"];
      const missingFields = requiredFields.filter(
        (field) => !(field in parsedContent)
      );
      if (missingFields.length > 0) {
        throw new AI21Error(
          `Missing required fields: ${missingFields.join(", ")}`,
          "MISSING_FIELDS"
        );
      }

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
      if (retries === CONFIG.maxRetries) {
        throw new AI21Error(
          `Failed to generate chapter after ${CONFIG.maxRetries} attempts.`,
          "MAX_RETRIES_EXCEEDED"
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
    }
  }
};

export default ai21;
