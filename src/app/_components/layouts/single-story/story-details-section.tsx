"use client";
import {
  BookOpen01Icon,
  BubbleChatIcon,
  CopyrightIcon,
  EyeIcon,
  FavouriteIcon,
  Flag02Icon,
  LeftToRightListNumberIcon,
  PlusSignSquareIcon,
  RecordIcon,
  ViewIcon,
  ViewOffIcon,
} from "hugeicons-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ChevronRight, MessageCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

const StoryDetailsSection = () => {
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);

  // Sample chapter data - replace with your actual data
  const chapters = [
    {
      id: 1,
      title: "The Unexpected Collaboration",
      date: "2 days ago",
      wordCount: "3.2k",
    },
    {
      id: 2,
      title: "First Recording Session",
      date: "1 week ago",
      wordCount: "4.1k",
    },
    {
      id: 3,
      title: "Creative Differences",
      date: "2 weeks ago",
      wordCount: "3.8k",
    },
    {
      id: 4,
      title: "Late Night Studio",
      date: "3 weeks ago",
      wordCount: "5.2k",
    },
  ];

  const discussions = [
    {
      id: 1,
      user: { name: "BookLover42", avatar: "/avatars/1.jpg" },
      comment: "The character development in this chapter was amazing!",
      date: "3 hours ago",
      replies: 5,
      spoiler: true,
    },
    {
      id: 2,
      user: { name: "StoryFanatic", avatar: "/avatars/2.jpg" },
      comment: "Can't wait to see what happens next with the main couple!",
      date: "1 day ago",
      replies: 2,
      spoiler: false,
    },
  ];

  const [revealedSpoilers, setRevealedSpoilers] = useState<number[]>([]);
  const [reportedComments, setReportedComments] = useState<number[]>([]);

  const toggleSpoiler = (id: number) => {
    if (revealedSpoilers.includes(id)) {
      setRevealedSpoilers(revealedSpoilers.filter((item) => item !== id));
    } else {
      setRevealedSpoilers([...revealedSpoilers, id]);
    }
  };

  const handleReport = (id: number) => {
    setReportedComments([...reportedComments, id]);
    // In a real app, you would also send this to your backend
  };

  return (
    <main className="w-full py-2">
      <div className="mb-6 flex items-start gap-8">
        <div>
          <h1 className="text-2xl leading-tight md:text-3xl lg:text-4xl xl:text-5xl font-black mb-4 text-slate-700">
            Collab to Love (A Twice x Male Reader Fanfic)
          </h1>
          <p className="mb-4 text-slate-700">
            By{" "}
            <span className="font-semibold text-primary underline underline-offset-2">
              Keggster
            </span>
          </p>
          <Badge>Mystry / Thriller</Badge>
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
                  105k
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="bg-slate-50 border border-slate-300"
              tooltipArrowClassName="bg-slate-50 border-b border-r border-slate-300 fill-slate-50"
            >
              <p className="text-slate-700 font-black">105,379 Reads</p>
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
                  74k
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="bg-slate-50 border border-slate-300"
              tooltipArrowClassName="bg-slate-50 border-b border-r border-slate-300 fill-slate-50"
            >
              <p className="text-slate-700 font-black">74,49 votes</p>
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
                  15
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="bg-slate-50 border border-slate-300"
              tooltipArrowClassName="bg-slate-50 border-b border-r border-slate-300 fill-slate-50"
            >
              <p className="text-slate-700 font-black">15 Chapters</p>
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
                  12 hour 49 minutes
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="bg-slate-50 border border-slate-300"
              tooltipArrowClassName="bg-slate-50 border-b border-r border-slate-300 fill-slate-50"
            >
              <p className="text-slate-700 font-black">12 hour 49 min</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="my-10 px-3 border-l-4 border-slate-300">
        <p className="text-base italic text-slate-800">
          Twice is a world wide known girl group... <br />
          we all know who they are <br />
          <br />
          But the world doesn't know you. <br />
          A dead beat local artist that has been looking for a big break. <br />
          <br />
          But when members of Twice takes liking to your music and asks you to
          help them with their comeback, will you help them or will you continue
          to pursue your own dreams as a solo artist, or is there even a chance
          to fall in love. And finding out that a certain someone from the past,
          blocked by your memory will be coming back into your life, how will
          you handle a forgotten friendship. <br /> <br />
        </p>
        <div className="flex items-center gap-1">
          <CopyrightIcon className="inline size-3.5" />
          <p className="text-sm font-medium text-slate-700">
            All Rights Reserved
          </p>
        </div>
      </div>

      <div className="my-6">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="border border-slate-300 text-sm px-3 py-1 bg-slate-200 text-slate-700">
            Romance
          </Badge>
          <Badge className="border border-slate-300 text-sm px-3 py-1 bg-slate-200 text-slate-700">
            Drama
          </Badge>
          <Badge className="border border-slate-300 text-sm px-3 py-1 bg-slate-200 text-slate-700">
            Action
          </Badge>
          <Badge className="border border-slate-300 text-sm px-3 py-1 bg-slate-200 text-slate-700">
            Adventure
          </Badge>
          <Badge className="border border-slate-300 text-sm px-3 py-1 bg-slate-200 text-slate-700">
            Fantasy
          </Badge>
        </div>
      </div>

      <div className="mt-10 border-t border-slate-200 pt-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          Table of Contents
        </h2>
        <div className="space-y-2">
          {chapters.map((chapter) => (
            <Link
              key={chapter.id}
              href={`/chapter/${chapter.id}`} // Update with your actual chapter route
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
                  <span className="text-sm text-slate-500">{chapter.date}</span>
                  <span className="text-sm text-slate-500">
                    {chapter.wordCount} words
                  </span>
                  <ChevronRight className="size-5 text-slate-500" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-10 border-t border-slate-200 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BubbleChatIcon className="size-5" />
            Discussions
          </h2>
          <Button variant="default" size="sm">
            Start New Discussion
          </Button>
        </div>

        <div className="space-y-4">
          {discussions.map((discussion) => (
            <div
              key={discussion.id}
              className="border bg-white border-slate-200 rounded-lg p-4"
            >
              <div className="flex gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">
                      {discussion.user.name}
                    </span>
                    <RecordIcon className="size-1.5 text-slate-500 fill-slate-500" />
                    <span className="text-sm text-slate-600">
                      {discussion.date}
                    </span>
                    {discussion.spoiler && (
                      <Badge variant="destructive" className="text-xs">
                        Spoiler
                      </Badge>
                    )}
                  </div>

                  <div className="mt-3">
                    {discussion.spoiler &&
                    !revealedSpoilers.includes(discussion.id) ? (
                      <div className="relative">
                        <div className="backdrop-blur-md px-3 py-2 bg-slate-50 rounded">
                          <p className="text-transparent select-none">
                            {discussion.comment}
                          </p>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="backdrop-blur-sm border-slate-300 shadow-sm"
                            onClick={() => toggleSpoiler(discussion.id)}
                            icon={ViewIcon}
                          >
                            Reveal Spoiler
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="group relative">
                        <p className="text-slate-700 px-1">
                          {discussion.comment}
                        </p>
                        {discussion.spoiler && (
                          <div className="absolute -right-2 -top-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-500 gap-1 hover:text-slate-700"
                              onClick={() => toggleSpoiler(discussion.id)}
                              title="Hide spoiler"
                              icon={ViewOffIcon}
                            >
                              Hide
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-500"
                      >
                        Reply
                      </Button>
                      <span className="text-sm text-slate-500 flex items-center gap-1">
                        <MessageCircle className="size-4" />
                        {discussion.replies} replies
                      </span>
                    </div>
                    {!reportedComments.includes(discussion.id) ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-500 hover:text-red-500"
                        icon={Flag02Icon}
                        onClick={() => handleReport(discussion.id)}
                      >
                        Report
                      </Button>
                    ) : (
                      <span className="text-xs text-slate-400">Reported</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Button variant="ghost" className="text-primary">
            View All Discussions
          </Button>
        </div>
      </div>
    </main>
  );
};

export default StoryDetailsSection;
