"use client";

import {
  BookOpen01Icon,
  EyeIcon,
  FileEditIcon,
  LeftToRightListNumberIcon,
  Megaphone01Icon,
  PencilEdit01Icon,
  StarIcon,
  ToggleOnIcon,
} from "hugeicons-react";
import {
  ExternalLink,
  EyeOffIcon,
  FileCheck2Icon,
  Settings2,
  Trash2Icon,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";
import BlurImage from "~/app/_components/shared/blur-image";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { env } from "~/env";
import type { StoryStatus } from "~/generated/enums";
import { useStoryRating } from "~/store/useStoryRating";
import { getReadingTimeText } from "~/utils/helpers";

const StoryAnalyticsInfo = ({
  info,
}: {
  info: {
    id: string;
    thumbnail: string;
    title: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
    genreSlug: string;
    readingTime: number;
    readCount: number;
    isCompleted: boolean;
    chapterCount: number;
    ratingCount: number;
    averageRating: number;
    storyStatus: StoryStatus;
  };
}) => {
  const { averageRating, ratingCount, setRatingCount, setAverageRating } =
    useStoryRating();

  useEffect(() => {
    const { ratingCount, averageRating } = info;

    setRatingCount(ratingCount);
    setAverageRating(averageRating);

    // store session for the author analytics
    const referrer = document.referrer;

    if (referrer && referrer !== "" && referrer !== env.NEXT_PUBLIC_APP_URL)
      sessionStorage.setItem("ref", referrer);
  }, [info]);

  return (
    <section className="py-6 border-b border-border">
      <div className="flex items-center gap-6">
        <div className="w-8/12 xs:w-3/6 md:w-full max-w-[180px] h-auto shadow-lg rounded-md">
          <BlurImage
            src={info.thumbnail as string}
            className="rounded-md w-full select-none object-cover aspect-[1/1.6]"
            alt={info.title}
          />
        </div>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black mb-2 sm:mb-4 text-slate-700 leading-tight">
            {info.title}
          </h1>
          <div className="mb-4">
            <Link href={`/search?genre=${info.genreSlug}`}>
              <Badge
                className="capitalize text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1"
                variant={"destructive"}
              >
                {info.genreSlug}
              </Badge>
            </Link>
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
                      {info.readCount}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-slate-50 border border-slate-300 text-xs sm:text-sm"
                  tooltipArrowClassName="bg-slate-50 border-b border-r border-slate-300 fill-slate-50"
                >
                  <p className="text-slate-700 font-black">
                    {info.readCount} Reads
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
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-slate-50 border border-slate-300 text-xs sm:text-sm"
                  tooltipArrowClassName="bg-slate-50 border-b border-r border-slate-300 fill-slate-50"
                >
                  <p className="text-slate-700 font-black">
                    {averageRating.toFixed(1)} (
                    {Intl.NumberFormat().format(ratingCount)})
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
                      {info.chapterCount}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-slate-50 border border-slate-300 text-xs sm:text-sm"
                  tooltipArrowClassName="bg-slate-50 border-b border-r border-slate-300 fill-slate-50"
                >
                  <p className="text-slate-700 font-black">
                    {info.chapterCount} Chapters
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
                      {getReadingTimeText(info.readingTime)}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-slate-50 border border-slate-300 text-xs sm:text-sm"
                  tooltipArrowClassName="bg-slate-50 border-b border-r border-slate-300 fill-slate-50"
                >
                  <p className="text-slate-700 font-black">
                    {getReadingTimeText(info.readingTime)}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center mt-8 justify-between">
            <div className="flex gap-2 items-center">
              <Link href={`/write?editId=${info.id}`}>
                <Button
                  icon={PencilEdit01Icon}
                  className="bg-blue-500 text-blue-50 hover:bg-blue-600 transition duration-200 hover:text-blue-50"
                  variant={"secondary"}
                >
                  Edit Story
                </Button>
              </Link>

              <Tooltip>
                <TooltipProvider>
                  <TooltipTrigger>
                    <Button disabled icon={TrendingUp}>
                      Boost Work
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" variant="outline">
                    Comming soon
                  </TooltipContent>
                </TooltipProvider>
              </Tooltip>
              <DropdownMenu>
                <Button asChild icon={Settings2} variant="outline">
                  <DropdownMenuTrigger>Take Actions</DropdownMenuTrigger>
                </Button>
                <DropdownMenuContent className="w-[190px]" align="start">
                  <DropdownMenuGroup>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <ToggleOnIcon className="mr-4 h-4 w-4" />
                        Change Status
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem
                            disabled={info.storyStatus === "DRAFT"}
                          >
                            <FileEditIcon className="mr-2 h-4 w-4" /> DRAFT
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={info.storyStatus === "PUBLISHED"}
                          >
                            <FileCheck2Icon className="mr-2 h-4 w-4" /> PUBLISH
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={info.storyStatus === "PRIVATE"}
                          >
                            <EyeOffIcon className="mr-2 h-4 w-4" /> PRIVATE
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>

                  <DropdownMenuItem>
                    <Megaphone01Icon className="mr-2 h-4 w-4" /> Run Ads
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="text-red-600">
                    <Trash2Icon className="mr-2 h-4 w-4 text-red-600" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button
              variant={"outline"}
              icon={ExternalLink}
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.info("URL Copied");
              }}
            >
              Share
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoryAnalyticsInfo;
