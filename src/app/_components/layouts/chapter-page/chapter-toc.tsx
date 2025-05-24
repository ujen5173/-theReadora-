"use client";

import { BookOpenIcon, ChevronDownIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import { useChapterStore } from "~/store/useChapter";
import { useUserStore } from "~/store/userStore";
import { api } from "~/trpc/react";
import { isChapterScheduled } from "~/utils/helpers";
import AddToList from "../../shared/add-to-list";
import { StarRating } from "../single-story/star-rating";

const ChapterTOC = () => {
  const { story, chapter: currentChapter } = useChapterStore();
  const { user } = useUserStore();

  const { data: rating } = api.user.getRating.useQuery(
    {
      storyId: story?.id as string,
    },
    {
      enabled: !!story?.id && !!user?.id,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <section className="w-full border-b border-gray-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-4 gap-3 sm:gap-6 py-2 sm:py-0">
        <div className="w-full sm:w-auto sm:border-r sm:border-border sm:pr-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full">
              <div className="w-full sm:w-80 flex items-center justify-between gap-2 sm:gap-4">
                <div className="flex gap-2 flex-1 items-center min-w-0">
                  {story?.thumbnail ? (
                    <Image
                      src={story?.thumbnail}
                      alt={story?.title}
                      width={40}
                      height={36}
                      className="aspect-[1/1.6] rounded-sm border border-gray-200 flex-shrink-0"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-gray-200 flex-shrink-0">
                      <BookOpenIcon className="h-4 w-4" />
                    </div>
                  )}
                  <div className="flex flex-col items-start min-w-0">
                    <p className="text-sm sm:text-base font-semibold truncate w-full">
                      {story?.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      by @{story?.author.username}
                    </p>
                  </div>
                </div>
                <ChevronDownIcon className="w-4 h-4 flex-shrink-0" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[calc(100vw-2rem)] sm:w-80 p-0 mx-2 sm:mx-4">
              {/* Header */}
              <div className="p-3 border-b border-border">
                <Link
                  href={`/story/${story?.slug}`}
                  className="flex flex-col items-center gap-0.5"
                >
                  <h3 className="text-sm font-medium text-slate-700 hover:text-primary transition-colors truncate w-full text-center">
                    {story?.title}
                  </h3>
                  <p className="text-xs text-slate-500">Table of Contents</p>
                </Link>
              </div>

              {/* Chapter List */}
              <div className="py-1.5 max-h-[50vh] overflow-y-auto">
                {story?.chapters.map((chapter) => {
                  const isActive = chapter.id === currentChapter?.id;
                  const isAuthor = user?.id === story?.author.id;

                  if (
                    chapter.scheduledFor &&
                    !isAuthor &&
                    !isChapterScheduled(chapter.scheduledFor)
                  ) {
                    return null;
                  }

                  return (
                    <Link key={chapter.id} href={`/chapter/${chapter.slug}`}>
                      <DropdownMenuItem
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 cursor-pointer",
                          "hover:bg-slate-50",
                          isActive && "bg-rose-50"
                        )}
                      >
                        <span
                          className={cn(
                            "text-xs flex-shrink-0",
                            isActive
                              ? "text-primary font-medium"
                              : "text-slate-500"
                          )}
                        >
                          {chapter.chapterNumber.toString().padStart(2, "0")}
                        </span>

                        <span
                          className={cn(
                            "text-sm line-clamp-1 flex-1",
                            isActive
                              ? "text-primary font-medium"
                              : "text-slate-700"
                          )}
                        >
                          {chapter.title}
                        </span>

                        {isActive && (
                          <div className="size-1 bg-primary rounded-full flex-shrink-0" />
                        )}
                      </DropdownMenuItem>
                    </Link>
                  );
                })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="hidden md:flex items-center gap-2 w-full sm:w-auto">
          {story && <AddToList storyId={story.id} />}
          {story && (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={"outline"} className="w-full">
                    <div className="flex items-center gap-2">
                      <StarRating
                        storyId={story.id}
                        isInteractive={false}
                        rating={story.averageRating}
                        className="flex-shrink-0"
                        removeStars
                      />
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {`(${story.ratingCount})` || "..."}
                      </span>
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  variant="outline"
                  className="text-xs sm:text-sm"
                  side="top"
                >
                  {rating ? (
                    <p>Your rating: {rating.rating}</p>
                  ) : (
                    <p>Rate this story</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </section>
  );
};

export default ChapterTOC;
