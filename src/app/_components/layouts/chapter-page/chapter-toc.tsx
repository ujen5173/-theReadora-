"use client";
import { StarIcon } from "hugeicons-react";
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
import { cn } from "~/lib/utils";
import { useChapterStore } from "~/store/useChapter";
import { useUserStore } from "~/store/userStore";
import { isChapterScheduled } from "~/utils/helpers";
import ReadingListDialog from "../../shared/reading-list";

const ChapterTOC = () => {
  const { story, chapter: currentChapter } = useChapterStore();
  const { user } = useUserStore();

  return (
    <section className="w-full border-b border-gray-200">
      <div className="flex items-center justify-between px-4 gap-6">
        <div className="border-r border-border pr-4">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="w-80 flex items-center justify-between gap-4">
                <div className="flex gap-2 flex-1 items-center">
                  {story?.thumbnail ? (
                    <Image
                      src={story?.thumbnail}
                      alt={story?.title}
                      width={40}
                      height={36}
                      className="aspect-[1/1.5] rounded-sm border border-gray-200"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-gray-200">
                      <BookOpenIcon className="h-4 w-4" />
                    </div>
                  )}
                  <div className="flex flex-col items-start">
                    <p className="text-base font-semibold">{story?.title}</p>
                    <p className="text-xs text-gray-500">
                      by @{story?.author.username}
                    </p>
                  </div>
                </div>
                <ChevronDownIcon className="w-4 h-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-0 mx-4">
              {/* Header */}
              <div className="p-3 border-b border-border">
                <Link
                  href={`/story/${story?.slug}`}
                  className="flex flex-col items-center gap-0.5"
                >
                  <h3 className="text-sm font-medium text-slate-700 hover:text-primary transition-colors">
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
                        {/* Chapter Number */}
                        <span
                          className={cn(
                            "text-xs",
                            isActive
                              ? "text-primary font-medium"
                              : "text-slate-500"
                          )}
                        >
                          {chapter.chapterNumber.toString().padStart(2, "0")}
                        </span>

                        {/* Chapter Title */}
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

                        {/* Active Indicator */}
                        {isActive && (
                          <div className="size-1 bg-primary rounded-full" />
                        )}
                      </DropdownMenuItem>
                    </Link>
                  );
                })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <ReadingListDialog>
            <Button icon={StarIcon} variant="outline">
              Add to Reading List
            </Button>
          </ReadingListDialog>
          <Button icon={StarIcon} variant="outline">
            Vote
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ChapterTOC;
