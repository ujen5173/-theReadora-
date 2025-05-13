"use client";

import { ChevronDown, ChevronUp, Goal, PenLine, Plus } from "lucide-react";
import Image from "next/image";
import { redirect, useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import readingTimeCalc from "reading-time";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { useNewChapterStore } from "~/store/useNewChapter";
import { api } from "~/trpc/react";
import { getReadingTimeText } from "~/utils/helpers";
import PremiumBanner from "../../shared/premium-banner";
import NewChapterDialog from "./new-chapter-dialog";
import PremiumChapter from "./premium-chapter";

const StoryEditorSidebar = () => {
  const { story_id } = useParams();

  const chapter_id = useSearchParams().get("chapter_id");

  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const { title, htmlContent, wordCount } = useNewChapterStore();

  const {
    data: story,
    isLoading,
    error,
  } = api.story.getStoryInfo.useQuery({
    storyId: story_id as string,
  });

  if (error) {
    toast.error("Error fetching story info");
    redirect("/");
  }

  const [open, setOpen] = useState(false);

  const onboardNewChapter = () => {
    setOpen(true);
  };

  return (
    <>
      <NewChapterDialog open={open} onOpenChange={setOpen} />

      <div className="w-72 hidden lg:block space-y-4">
        <div className="bg-white rounded-xl border border-border dark:border-slate-700/50 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              Story Info
            </h3>
          </div>
          <div className="flex gap-2">
            {isLoading ? (
              <div className="flex gap-2 w-full">
                <Skeleton className="h-28 w-20 rounded-md" />
                <div className="flex flex-col flex-1 gap-2">
                  <Skeleton className="h-5 w-full rounded-md" />
                  <Skeleton className="h-5 w-18 rounded-md" />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <Image
                    src={story?.thumbnail as string}
                    alt={story?.title || "Story Thumbnail"}
                    width={100}
                    height={100}
                    className="aspect-[1/1.5] rounded-md"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold text-slate-700">
                    {story?.title}
                  </h3>
                  <Badge
                    variant="secondary"
                    className="border border-border text-xs"
                  >
                    {story?.storyStatus}
                  </Badge>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border dark:border-slate-700/50 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              <PenLine className="h-4 w-4 text-primary" />
              Chapter Navigator
            </h3>
          </div>
          <div className="space-y-2 w-full mt-3">
            <ScrollArea className="max-h-72 w-[16.8rem]">
              <div className="space-y-2 pr-4 w-[16.8rem]">
                {story?.chapters.map((chapter) => (
                  <div key={chapter.id} className="flex min-w-0">
                    <p className="w-full text-sm font-semibold text-slate-600 hover:bg-slate-100 p-2 rounded-md border border-border cursor-pointer transition-colors truncate">
                      {chapter.chapterNumber.toString().padStart(2, "0")}:{" "}
                      {chapter.title}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            {!chapter_id && (
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-rose-600 hover:bg-rose-100 bg-rose-50 border border-rose-200 p-2 rounded-md cursor-pointer transition-colors truncate max-w-full">
                  Chapter {(story?.chapters ?? []).length + 1}: {title}
                </p>
              </div>
            )}
            <Separator className="mt-4" />
            <div
              onClick={onboardNewChapter}
              className="text-sm flex items-center gap-1 font-semibold text-slate-600 hover:bg-slate-100  p-2 rounded-md cursor-pointer transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add New Chapter
            </div>
          </div>
        </div>

        <Collapsible
          open={isStatsOpen}
          onOpenChange={setIsStatsOpen}
          className="bg-white rounded-xl border border-border dark:border-slate-700/50 p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center text-slate-700 gap-2">
              <Goal className="h-4 w-4 text-primary" />
              Writing Stats
            </h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {isStatsOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="space-y-3 mt-3">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Reading Time</div>
              <div className="text-base font-semibold">
                {readingTimeCalc(htmlContent).text === "0 min read"
                  ? "N/A"
                  : getReadingTimeText(readingTimeCalc(htmlContent).time)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">
                Total Word Count
              </div>
              <div className="text-base font-semibold">
                {Intl.NumberFormat().format(wordCount)}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <PremiumBanner />

        {/* <ExportChapter /> */}

        <PremiumChapter />
      </div>
    </>
  );
};

export default StoryEditorSidebar;
