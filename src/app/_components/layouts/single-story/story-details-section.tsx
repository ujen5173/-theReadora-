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
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import type { Story } from "@prisma/client";

interface StoryDetailsSectionProps {
  story: Story & {
    author: {
      id: string;
      name: string;
      username: string;
    };
    chapters: {
      id: string;
      title: string;
      createdAt: Date;
      metrics: {
        wordCount: number;
        readingTime: number;
        likesCount: number;
        commentsCount: number;
        viewsCount: number;
        sharesCount: number;
        ratingCount: number;
        ratingValue: number;
        ratingAvg: number;
      };
    }[];
  };
}

const StoryDetailsSection = ({ story }: StoryDetailsSectionProps) => {
  return (
    <main className="w-full py-2">
      <div className="mb-6 flex items-start gap-8">
        <div className="flex-1">
          <h1 className="text-2xl leading-tight md:text-3xl lg:text-4xl xl:text-5xl font-black mb-4 text-slate-700">
            {story.title}
          </h1>
          <p className="mb-4 text-slate-700">
            By{" "}
            <span className="font-semibold text-primary underline underline-offset-2">
              {story.author.name}
            </span>
          </p>
          <Badge
            className="capitalize text-base px-3 py-1"
            variant={"destructive"}
          >
            {story.genreSlug}
          </Badge>
        </div>
        <div className="py-4">
          <Button
            variant={"default"}
            icon={PlusSignSquareIcon}
            className="w-full"
          >
            Follow
          </Button>
        </div>
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
                  {story.reads.toLocaleString()}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="bg-slate-50 border border-slate-300"
              tooltipArrowClassName="bg-slate-50 border-b border-r border-slate-300 fill-slate-50"
            >
              <p className="text-slate-700 font-black">
                {story.reads.toLocaleString()} Reads
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
                  {Math.floor(story.readingTime / 60)}h {story.readingTime % 60}
                  m
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="bg-slate-50 border border-slate-300"
              tooltipArrowClassName="bg-slate-50 border-b border-r border-slate-300 fill-slate-50"
            >
              <p className="text-slate-700 font-black">
                {Math.floor(story.readingTime / 60)}hour{" "}
                {story.readingTime % 60}min
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="my-10 px-3 border-l-4 border-slate-300">
        <p className="text-lg mb-4 text-slate-800">{story.synopsis}</p>
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

      <div className="mt-10 border-t border-slate-200 pt-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          Table of Contents
        </h2>
        {story.chapters.length > 0 ? (
          <div className="space-y-2">
            {story.chapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/chapter/${chapter.id}`}
                className="block bg-white border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-slate-700">
                      Chapter {chapter.id}:
                    </span>
                    <span className="text-slate-800 font-semibold">
                      {chapter.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-500">
                      {new Date(chapter.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-sm text-slate-500">
                      {chapter.metrics.wordCount} words
                    </span>
                    <ChevronRight className="size-5 text-slate-500" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="h-30 flex items-center justify-center">
            <p className="text-slate-700 font-medium text-lg text-center">
              Oops! Chapters are not written yet.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default StoryDetailsSection;
