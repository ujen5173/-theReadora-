"use client";

import { StoryStatus } from "@prisma/client";
import { Loader2, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import readingTime from "reading-time";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { useNewChapterStore } from "~/store/useNewChapter";
import { api } from "~/trpc/react";

const chapterSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  htmlContent: z
    .string()
    .min(10, "Content must be at least 10 characters long"),
});

const StoryEditorFooter = () => {
  const router = useRouter();
  const { story_id } = useParams();

  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const {
    title,
    wordCount,
    htmlContent,
    isLocked,
    price,
    setHardSaved,
    setResetForm,
    setWordCount,
  } = useNewChapterStore();
  const {
    mutateAsync: createChapter,
    status,
    error,
  } = api.chapter.create.useMutation();

  if (error) {
    toast.error(error.message);
  }

  const handlePublish = async () => {
    try {
      const result = chapterSchema.safeParse({
        title,
        htmlContent,
      });

      if (!result.success) {
        // Show the first validation error
        toast.error(result?.error?.errors?.[0]?.message);
        return;
      }

      const res = await createChapter({
        title,
        wordCount,
        readingTime: readingTime(htmlContent).time,
        status: StoryStatus.PUBLISHED,
        content: htmlContent,
        storyId: story_id as string,
        isLocked,
        price,
      });

      if (res.success) {
        toast.success(res.message);
        router.push(`/story/${res.storySlug}/`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to publish chapter");
    } finally {
      setResetForm();
      setWordCount(0);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setIsSavingDraft(true);
      await createChapter({
        title,
        wordCount,
        status: StoryStatus.DRAFT,
        content: htmlContent,
        readingTime: readingTime(htmlContent).time,
        storyId: story_id as string,
        isLocked,
        price,
      });

      setHardSaved(true);
      toast.success("Draft saved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save draft");
    } finally {
      setIsSavingDraft(false);
    }
  };

  return (
    <div className="flex justify-between items-center mt-6 pt-6 border-t">
      <Button variant="outline" icon={Users} className="text-muted-foreground">
        Add Collaborators
      </Button>

      <div className="flex gap-3">
        <Button
          onClick={handleSaveDraft}
          variant="outline"
          disabled={status === "pending" || isSavingDraft}
        >
          {isSavingDraft && <Loader2 className="size-4 animate-spin" />}
          Save Draft
        </Button>
        <Button
          onClick={handlePublish}
          disabled={status === "pending"}
          className="bg-gradient-to-r from-primary/80 to-primary text-white hover:from-primary hover:to-primary/90"
          effect="shineHover"
        >
          {status === "pending" && <Loader2 className="size-4 animate-spin" />}
          Publish Chapter
        </Button>
      </div>
    </div>
  );
};

export default StoryEditorFooter;
