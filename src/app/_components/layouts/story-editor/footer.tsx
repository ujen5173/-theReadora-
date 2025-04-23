import { StoryStatus } from "@prisma/client";
import { Users } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useNewChapterStore } from "~/store/useNewChapter";
import { api } from "~/trpc/react";

const StoryEditorFooter = () => {
  const { storyId, title, wordCount, htmlContent, content } =
    useNewChapterStore();
  const { mutateAsync: createChapter } = api.chapter.create.useMutation();

  return (
    <div className="flex justify-between items-center mt-6 pt-6 border-t">
      <Button variant="outline" icon={Users} className="text-muted-foreground">
        Add Collaborators
      </Button>

      <div className="flex gap-3">
        <Button
          onClick={async () => {
            try {
              await createChapter({
                title,
                wordCount,
                status: StoryStatus.DRAFT,
                content: htmlContent,
                storyId,
              });
            } catch (error) {
              console.error(error);
            }
          }}
          variant="outline"
        >
          Save Draft
        </Button>
        <Button
          onClick={async () => {
            try {
              console.log({
                title,
                wordCount,
                status: StoryStatus.PUBLISHED,
                content: htmlContent,
                storyId,
              });
              // await createChapter({
              //   title,
              //   wordCount,
              //   chapterNumber,
              //   status: StoryStatus.PUBLISHED,
              //   content: htmlContent,
              //   storyId,
              // });
            } catch (error) {
              console.error(error);
            }
          }}
          className="bg-gradient-to-r from-primary/80 to-primary text-white hover:from-primary hover:to-primary/90"
          effect="shineHover"
        >
          Publish Chapter
        </Button>
      </div>
    </div>
  );
};

export default StoryEditorFooter;
