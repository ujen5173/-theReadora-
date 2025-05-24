"use client";

import { StoryStatus } from "@prisma/client";
import { format } from "date-fns";
import {
  Calendar,
  ChevronDown,
  Clock,
  Loader2,
  Rocket,
  Users,
} from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import readingTime from "reading-time";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Calendar as CalendarComponent } from "~/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
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
  const isChapterForEdit = !!useSearchParams().get("chapter_id");

  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    undefined
  );
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const edit_id = useSearchParams().get("chapter_id");

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
  } = api.chapter.createOrUpdate.useMutation();

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

        edit: isChapterForEdit ? edit_id ?? undefined : undefined,
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

  const handleSchedulePublish = async () => {
    try {
      const result = chapterSchema.safeParse({
        title,
        htmlContent,
      });

      if (!result.success) {
        toast.error(result?.error?.errors?.[0]?.message);
        return;
      }

      if (!scheduledDate) {
        toast.error("Please select a publish date and time");
        return;
      }

      const res = await createChapter({
        title,
        wordCount,
        readingTime: readingTime(htmlContent).time,
        status: StoryStatus.SCHEDULED,
        content: htmlContent,
        storyId: story_id as string,
        isLocked,
        price,
        scheduledFor: scheduledDate,
      });

      if (res.success) {
        toast.success(`Chapter scheduled for ${format(scheduledDate, "PPp")}`);
        setScheduledDate(undefined);
        setIsScheduleOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to schedule chapter");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
      <Button
        variant="outline"
        icon={Users}
        className="text-muted-foreground w-full sm:w-auto"
      >
        Add Collaborators
      </Button>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Button
          onClick={handleSaveDraft}
          variant="outline"
          disabled={status === "pending" || isSavingDraft}
          className="w-full sm:w-auto"
        >
          {isSavingDraft && <Loader2 className="size-4 animate-spin" />}
          Save Draft
        </Button>

        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              disabled={status === "pending"}
              className="w-full sm:w-auto bg-gradient-to-r from-primary/80 to-primary text-white hover:from-primary hover:to-primary/90"
              effect="shineHover"
              icon={status === "pending" ? Loader2 : ChevronDown}
              iconStyle={status === "pending" ? "animate-spin" : "none"}
              iconPlacement="right"
            >
              {isChapterForEdit ? "Update Chapter" : "Publish Chapter"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem
              onClick={() => {
                setIsDropdownOpen(false);
                handlePublish();
              }}
              className="flex items-center gap-2 cursor-pointer text-primary hover:text-primary"
            >
              <Rocket className="h-4 w-4 text-inherit" />
              {isChapterForEdit ? (
                <span>Update Now</span>
              ) : (
                <span>Publish Now</span>
              )}
            </DropdownMenuItem>
            {!isChapterForEdit && (
              <DropdownMenuItem
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsScheduleOpen(true);
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="h-4 w-4" />
                <span>Schedule Publish</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
          <DialogContent className="sm:max-w-min w-[95vw] sm:w-auto">
            <DialogHeader>
              <DialogTitle>Schedule Publish</DialogTitle>
              <DialogDescription>
                Choose when you want to publish this chapter
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <CalendarComponent
                mode="single"
                selected={scheduledDate}
                onSelect={setScheduledDate}
                initialFocus
                disabled={(date) => date < new Date()}
                className="rounded-md w-full border [&>div>div]:w-full"
                showOutsideDays={false}
                classNames={{
                  head_cell:
                    "size-8 sm:size-10 text-slate-500 font-medium text-sm flex items-center justify-center",
                  cell: "size-8 sm:size-10",
                }}
              />
              <div className="mt-4 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <input
                  type="time"
                  className="border rounded px-2 py-1 w-full sm:w-auto"
                  onChange={(e) => {
                    if (scheduledDate) {
                      const [hours, minutes] = e.target.value.split(":") as [
                        string,
                        string
                      ];
                      const newDate = new Date(scheduledDate);
                      newDate.setHours(parseInt(hours), parseInt(minutes));
                      setScheduledDate(newDate);
                    }
                  }}
                />
              </div>
            </div>

            <p className="text-sm text-slate-700">
              Schedule at:{" "}
              <span className="italic underline font-medium">
                {scheduledDate ? format(scheduledDate, "PPp") : ""}?
              </span>
            </p>

            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setScheduledDate(undefined);
                  setIsScheduleOpen(false);
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSchedulePublish}
                disabled={!scheduledDate}
                className="w-full sm:w-auto"
              >
                Confirm Schedule
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StoryEditorFooter;
