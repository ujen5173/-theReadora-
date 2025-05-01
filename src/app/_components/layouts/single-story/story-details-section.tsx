"use client";

import {
  BookOpen01Icon,
  CopyrightIcon,
  EyeIcon,
  FavouriteIcon,
  LeftToRightListNumberIcon,
  PlusSignSquareIcon,
} from "hugeicons-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import type { Story } from "@prisma/client";
import type { ChapterMetrics } from "~/server/api/routers/story";
import { getReadingTimeText } from "~/utils/helpers";
import { useUserStore } from "~/store/userStore";
import TableOfContent from "./toc";
import { cn } from "~/lib/utils";
import { useState } from "react";
import Link from "next/link";

type Chapter = {
  id: string;
  title: string;
  createdAt: Date;
  chapterNumber: number;
  metrics: ChapterMetrics;
};

interface StoryDetailsSectionProps {
  story: Story & {
    author: {
      id: string;
      name: string;
      username: string;
    };
    chapters: Chapter[];
  };
}

const StoryDetailsSection = ({ story }: StoryDetailsSectionProps) => {
  const user = useUserStore();
  const [toggleReadMore, setToggleReadMore] = useState(false);

  const handleReadMore = () => {
    setToggleReadMore(!toggleReadMore);
  };

  return (
    <main className="w-full py-2 relative">
      <div className="mb-6 flex items-start gap-8">
        <div className="flex-1">
          <h1 className="text-2xl leading-tight md:text-3xl lg:text-4xl xl:text-5xl font-black mb-4 text-slate-700">
            {story.title}
          </h1>
          <p className="mb-4 text-slate-700">
            By{" "}
            <Link href={`/profile?user_id=${story.author.username}`}>
              <span className="font-semibold text-primary hover:underline underline-offset-2">
                {story.author.name}
              </span>
            </Link>
          </p>
          <Badge
            className="capitalize text-sm px-3 py-1"
            variant={"destructive"}
          >
            {story.genreSlug}
          </Badge>
        </div>
        {user?.user?.id !== story.author.id && (
          <div className="py-4">
            <Button
              variant={"default"}
              icon={PlusSignSquareIcon}
              className="w-full"
            >
              Follow
            </Button>
          </div>
        )}
      </div>

      <div className="flex">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="w-24 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1.5">
                  <EyeIcon className="size-4" />
                  <span className="font-medium text-base text-slate-800">
                    Reads
                  </span>
                </div>
                <span className="font-bold text-base text-center text-slate-700">
                  {story.readCount.toLocaleString()}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="bg-slate-50 border border-slate-300"
              tooltipArrowClassName="bg-slate-50 border-b border-r border-slate-300 fill-slate-50"
            >
              <p className="text-slate-700 font-black">
                {story.readCount.toLocaleString()} Reads
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="mx-4 h-[50px!important] border-r-2 border-slate-300"></div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="w-24 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1.5">
                  <FavouriteIcon className="size-4" />
                  <span className="font-medium text-base text-slate-800">
                    Votes
                  </span>
                </div>
                <span className="font-bold text-base text-center text-slate-700">
                  {story.votes.toLocaleString()}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="bg-slate-50 border border-slate-300"
              tooltipArrowClassName="bg-slate-50 border-b border-r border-slate-300 fill-slate-50"
            >
              <p className="text-slate-700 font-black">
                {story.votes.toLocaleString()} Votes
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="mx-4 h-[50px!important] border-r-2 border-slate-300"></div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="w-24 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1.5">
                  <LeftToRightListNumberIcon className="size-4" />
                  <span className="font-medium text-base text-slate-800">
                    Chapters
                  </span>
                </div>
                <span className="font-bold text-base text-center text-slate-700">
                  {story.chapterCount}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="bg-slate-50 border border-slate-300"
              tooltipArrowClassName="bg-slate-50 border-b border-r border-slate-300 fill-slate-50"
            >
              <p className="text-slate-700 font-black">
                {story.chapterCount} Chapters
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="mx-4 h-[50px!important] border-r-2 border-slate-300"></div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="w-24 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1.5">
                  <BookOpen01Icon className="size-4" />
                  <span className="font-medium text-base text-slate-800">
                    Time
                  </span>
                </div>
                <span className="font-bold line-clamp-1 text-base text-center text-slate-700">
                  {getReadingTimeText(story.readingTime)}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="bg-slate-50 border border-slate-300"
              tooltipArrowClassName="bg-slate-50 border-b border-r border-slate-300 fill-slate-50"
            >
              <p className="text-slate-700 font-black">
                {getReadingTimeText(story.readingTime)}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="my-10 px-3 border-l-4 border-slate-300">
        <p
          className={cn(
            !toggleReadMore ? "line-clamp-10" : "",
            "text-lg mb-4 text-slate-800 whitespace-pre-line"
          )}
        >
          {story.synopsis}
        </p>
        {story.synopsis.length > 250 && (
          <span
            className="underline text-primary/70 underline-offset-2 cursor-pointer my-4 inline-block font-semibold "
            onClick={handleReadMore}
          >
            {toggleReadMore ? "Read Less" : "Read More"}
          </span>
        )}
        <div className="flex items-center gap-1">
          <CopyrightIcon className="inline size-3.5" />
          <p className="text-base font-medium text-slate-700">
            All Rights Reserved
          </p>
        </div>
      </div>

      <div className="my-6">
        <div className="flex items-center gap-2 flex-wrap">
          {story.tags.map((tag) => (
            <Badge
              key={tag}
              className="border border-slate-300 text-sm px-3 py-1 bg-slate-200 text-slate-700"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <TableOfContent
        storyId={story.id}
        chapters={story.chapters}
        isAuthor={user?.user?.id === story.author.id}
      />
    </main>
  );
};

export default StoryDetailsSection;
