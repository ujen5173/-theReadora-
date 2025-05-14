"use client";

import type { ChapterPricePool } from "@prisma/client";
import type { JsonValue } from "@prisma/client/runtime/library";
import {
  BookOpen01Icon,
  BotIcon,
  CopyrightIcon,
  EyeIcon,
  LeftToRightListNumberIcon,
  StarIcon,
} from "hugeicons-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import type { T_byID_or_slug } from "~/server/api/routers/story";
import { useUserStore } from "~/store/userStore";
import { getReadingTimeText } from "~/utils/helpers";
import FollowButton from "../../shared/follow-button";
import TableOfContent from "./toc";

type Chapter = {
  id: string;
  title: string;
  createdAt: Date;
  chapterNumber: number;
  metrics: JsonValue;
  readershipAnalytics: JsonValue;
  isLocked: boolean;
  price: ChapterPricePool | null;
  scheduledFor: Date | null;
};

interface StoryDetailsSectionProps {
  story: T_byID_or_slug;
}

const StoryDetailsSection = ({ story }: StoryDetailsSectionProps) => {
  const user = useUserStore();
  const [toggleReadMore, setToggleReadMore] = useState(false);

  const handleReadMore = () => {
    setToggleReadMore(!toggleReadMore);
  };

  return (
    <main className="w-full py-2 relative">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black mb-2 sm:mb-4 text-slate-700 leading-tight">
            {story.title}
          </h1>
          <p className="mb-3 sm:mb-4 text-sm sm:text-base text-slate-700">
            By{" "}
            <Link href={`/profile?user_id=${story.author.username}`}>
              <span className="font-semibold text-primary hover:underline underline-offset-2">
                {story.author.name}
              </span>
            </Link>
          </p>
          <Badge
            className="capitalize text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1"
            variant={"destructive"}
          >
            {story.genreSlug}
          </Badge>
        </div>

        {user?.user?.id !== story.author.id && (
          <div className="py-2 sm:py-4">
            <FollowButton
              followingTo={{
                id: story.author.id,
                name: story.author.name,
              }}
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-between sm:justify-start gap-4 sm:gap-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="w-20 sm:w-24 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <EyeIcon className="size-3.5 sm:size-4" />
                  <span className="font-medium text-sm sm:text-base text-slate-800">
                    Reads
                  </span>
                </div>
                <span className="font-bold text-sm sm:text-base text-center text-slate-700">
                  {story.readCount}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="bg-slate-50 border border-slate-300 text-xs sm:text-sm"
              tooltipArrowClassName="bg-slate-50 border-b border-r border-slate-300 fill-slate-50"
            >
              <p className="text-slate-700 font-black">
                {story.readCount} Reads
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="hidden sm:block mx-4 h-[50px!important] border-r-2 border-slate-300"></div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="w-20 sm:w-24 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <StarIcon className="size-3.5 sm:size-4" />
                  <span className="font-medium text-sm sm:text-base text-slate-800">
                    Rating
                  </span>
                </div>
                <span className="font-bold text-sm sm:text-base text-center text-slate-700">
                  {story.ratingAvg.toFixed(1)}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="bg-slate-50 border border-slate-300 text-xs sm:text-sm"
              tooltipArrowClassName="bg-slate-50 border-b border-r border-slate-300 fill-slate-50"
            >
              <p className="text-slate-700 font-black">
                {story.ratingAvg.toFixed(1)} (
                {Intl.NumberFormat().format(story.ratingCount)})
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="hidden sm:block mx-4 h-[50px!important] border-r-2 border-slate-300"></div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="w-20 sm:w-24 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <LeftToRightListNumberIcon className="size-3.5 sm:size-4" />
                  <span className="font-medium text-sm sm:text-base text-slate-800">
                    Chapters
                  </span>
                </div>
                <span className="font-bold text-sm sm:text-base text-center text-slate-700">
                  {story.chapterCount}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="bg-slate-50 border border-slate-300 text-xs sm:text-sm"
              tooltipArrowClassName="bg-slate-50 border-b border-r border-slate-300 fill-slate-50"
            >
              <p className="text-slate-700 font-black">
                {story.chapterCount} Chapters
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="hidden sm:block mx-4 h-[50px!important] border-r-2 border-slate-300"></div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="w-20 sm:w-24 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <BookOpen01Icon className="size-3.5 sm:size-4" />
                  <span className="font-medium text-sm sm:text-base text-slate-800">
                    Time
                  </span>
                </div>
                <span className="font-bold line-clamp-1 text-sm sm:text-base text-center text-slate-700">
                  {getReadingTimeText(story.readingTime)}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="bg-slate-50 border border-slate-300 text-xs sm:text-sm"
              tooltipArrowClassName="bg-slate-50 border-b border-r border-slate-300 fill-slate-50"
            >
              <p className="text-slate-700 font-black">
                {getReadingTimeText(story.readingTime)}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="my-6 sm:my-10 px-3 border-l-4 border-slate-300">
        <p
          className={cn(
            !toggleReadMore ? "line-clamp-6 sm:line-clamp-10" : "",
            "text-base sm:text-lg mb-4 text-slate-800 whitespace-pre-line"
          )}
        >
          {story.synopsis}
        </p>
        {story.synopsis.length > 250 && (
          <span
            className="underline text-primary/70 underline-offset-2 cursor-pointer my-4 block text-sm sm:text-base font-semibold"
            onClick={handleReadMore}
          >
            {toggleReadMore ? "Read Less" : "Read More"}
          </span>
        )}
        <div className="flex items-center gap-1">
          <CopyrightIcon className="inline size-3 sm:size-3.5" />
          <p className="text-sm sm:text-base font-medium text-slate-700">
            All Rights Reserved
          </p>
        </div>
      </div>

      <div className="my-4 sm:my-6">
        <div className="flex items-center gap-2 flex-wrap">
          {story.tags.map((tag) => (
            <Badge
              key={tag}
              className="border border-slate-300 text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 bg-slate-200 text-slate-700"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {story.hasAiContent && (
        <div className="p-3 sm:p-4 flex items-center gap-2 rounded-md bg-orange-100 border border-orange-300">
          <BotIcon className="size-4 sm:size-5 text-orange-600" />
          <p className="text-sm sm:text-base text-orange-600 font-bold">
            This story is generated using AI.
          </p>
        </div>
      )}

      <TableOfContent
        storyId={story.id}
        chapters={story.chapters}
        isAuthor={user?.user?.id === story.author.id}
      />
    </main>
  );
};

export default StoryDetailsSection;
