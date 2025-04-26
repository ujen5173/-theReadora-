// @params
// [story_id] is the id of the story
// ?chapter_id is the id of the chapter
// - if chapter_id is not provided, the user is CREATING a new chapter
//   - chapters can be ordered by the chapter number
// - if chapter_id is provided, the user is EDITING an existing chapter

// TODO:
// - add search and find and replace feature.

"use client";
import { Tabs, TabsContent } from "~/components/ui/tabs";
import { Editor } from "~/app/_components/layouts/editor";
import "~/styles/editor.css";

// Import the editor styles
import StoryEditorHeader from "~/app/_components/layouts/story-editor/header";
import StoryEditorTabs from "~/app/_components/layouts/story-editor/tabs";
import StoryEditorSidebar from "~/app/_components/layouts/story-editor/side-bar";
import StoryEditorFooter from "~/app/_components/layouts/story-editor/footer";
import { useNewChapterStore } from "~/store/useNewChapter";
import type { JSONContent } from "novel";

const StoryEditor = () => {
  const {
    setContent,
    content,
    htmlContent,
    setHtmlContent,
    setWordCount,
    setIsAutoSaving,
    focusMode,
    setHardSaved,
  } = useNewChapterStore();

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
    <div className="bg-[#FCFCFC]">
      <StoryEditorHeader />

      <div className="max-w-[1440px] mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Main Editor Area */}
          <div className="flex-1">
            <Tabs defaultValue="write" className="h-full">
              <StoryEditorTabs />

              <div className="editor-container h-full bg-white dark:bg-slate-800 rounded-xl border border-border dark:border-slate-700/50 shadow-sm transition-all">
                <TabsContent
                  value="write"
                  className="min-h-[600px] max-h-[800px] h-[80vh]"
                >
                  <Editor
                    initialContent={content}
                    onChange={handleEditorChange}
                    placeholder="Start writing your story..."
                    autoFocus
                    className="min-h-[600px] max-h-[800px] h-[80vh] overflow-y-auto"
                  />
                </TabsContent>

                <TabsContent
                  value="preview"
                  className="preview-content min-h-[70vh] p-6"
                >
                  <div
                    className="prose prose-slate dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: htmlContent || "Your preview will appear here",
                    }}
                  />
                </TabsContent>

                {/* <TabsContent value="notes" className="min-h-[70vh] p-6">
                  <textarea
                    className="w-full h-full min-h-[calc(100vh-300px)] bg-transparent resize-none focus:outline-none"
                    placeholder="Add notes, research, or ideas for this chapter..."
                  />
                </TabsContent> */}
              </div>
            </Tabs>
          </div>

          {/* Right Sidebar - Only visible in normal mode */}
          {!focusMode && <StoryEditorSidebar />}
        </div>

        {/* Footer Actions - Only in normal mode */}
        <StoryEditorFooter />
      </div>
    </div>
  );
};

export default StoryEditor;
