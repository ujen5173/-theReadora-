// @params
// [story_id] is the id of the story
// ?chapter_id is the id of the chapter
// - if chapter_id is not provided, the user is CREATING a new chapter
//   - chapters can be ordered by the chapter number
// - if chapter_id is provided, the user is EDITING an existing chapter

// TODO:
// - add search and find and replace feature.

"use client";
import { Editor } from "~/app/_components/layouts/editor";
import { Tabs, TabsContent } from "~/components/ui/tabs";
import "~/styles/editor.css";

// Import the editor styles
import { generateJSON } from "@tiptap/html";
import type { JSONContent } from "novel";
import type { ChapterMetrics } from "prisma/types";
import React from "react";
import StoryEditorFooter from "~/app/_components/layouts/story-editor/footer";
import StoryEditorHeader from "~/app/_components/layouts/story-editor/header";
import StoryEditorSidebar from "~/app/_components/layouts/story-editor/side-bar";
import StoryEditorTabs from "~/app/_components/layouts/story-editor/tabs";
import { defaultExtensions } from "~/lib/noveh-sh-extensions";
import type { getDataForEditResponse } from "~/server/api/routers/chapter";
import { useNewChapterStore } from "~/store/useNewChapter";

const StoryEditor = ({
  chapterDetail,
  randomNumber,
}: {
  chapterDetail: getDataForEditResponse | null;
  randomNumber: number; // Used to force re-render on new chapter creation
}) => {
  const getJSONContent = (content: string) =>
    generateJSON(content, defaultExtensions);

  // Initialize store with chapter data if available
  const chapter_data_for_edit = React.useMemo(
    () =>
      chapterDetail
        ? {
            storyId: chapterDetail.story.id,
            title: chapterDetail.title,
            content: getJSONContent(
              chapterDetail.content
                .flat()
                .map((chunk) => chunk.content)
                .join("")
            ),
            htmlContent: chapterDetail.content
              .flat()
              .map((chunk) => chunk.content)
              .join(""),
            isLocked: chapterDetail.isLocked,
            wordCount: (chapterDetail.metrics as ChapterMetrics)?.wordCount,
            price: chapterDetail.price,
          }
        : undefined,
    [chapterDetail]
  );

  // Use the store without default data
  const {
    setContent,
    content,
    htmlContent,
    setHtmlContent,
    setWordCount,
    setIsAutoSaving,
    focusMode,
    setHardSaved,
    updateDefaultData,
  } = useNewChapterStore();

  React.useEffect(() => {
    if (chapter_data_for_edit) {
      updateDefaultData(chapter_data_for_edit);
    }
  }, [chapter_data_for_edit, updateDefaultData]);

  const handleEditorChange = (json: string, html: string) => {
    setHardSaved(false);
    setContent(JSON.parse(json) as JSONContent);
    setHtmlContent(html);

    // Calculate word count from HTML content
    const text = html.replace(/<[^>]*>/g, " ");
    setWordCount(text.split(/\s+/).filter(Boolean).length);

    // Simulate auto-save
    setIsAutoSaving(true);
    setTimeout(() => setIsAutoSaving(false), 2000);
  };

  return (
    <div className="bg-[#FCFCFC] border-b border-border">
      <StoryEditorHeader />

      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          <div className="flex-1">
            <Tabs defaultValue="write" className="h-full">
              <StoryEditorTabs />

              <div className="editor-container h-full bg-white rounded-lg sm:rounded-xl border border-border shadow-sm transition-all">
                <TabsContent
                  value="write"
                  className="min-h-[400px] sm:min-h-[600px] max-h-[600px] sm:max-h-[800px] h-[60vh] sm:h-[80vh]"
                >
                  <Editor
                    key={randomNumber}
                    initialContent={chapter_data_for_edit?.content ?? content}
                    onChange={handleEditorChange}
                    className="min-h-[400px] sm:min-h-[600px] max-h-[600px] sm:max-h-[800px] h-[60vh] sm:h-[80vh] overflow-y-auto"
                  />
                </TabsContent>

                <TabsContent
                  value="preview"
                  className="preview-content min-h-[50vh] sm:min-h-[70vh] p-3 sm:p-6"
                >
                  <div
                    className="prose prose-slate dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: htmlContent || "Your preview will appear here",
                    }}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {!focusMode && <StoryEditorSidebar />}
        </div>

        <StoryEditorFooter />
      </div>
    </div>
  );
};

export default StoryEditor;
