"use client";

import {
  AnalyticsUpIcon,
  ArrowRight02Icon,
  LeftToRightListNumberIcon,
  LinkSquare02Icon,
  StarIcon,
  ViewIcon,
} from "hugeicons-react";
import Link from "next/link";
import { type FC } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { merriweatherFont } from "~/utils/font";
import { formatNumber } from "~/utils/helpers";
import AddToList from "./add-to-list";
import BlurImage from "./blur-image";

export type TCard = {
  id: string;
  slug: string;
  title: string;
  readCount: number;
  readingTime: number;
  thumbnail: string;
  isMature: boolean;
  isCompleted: boolean;
  genreSlug: string;
  averageRating: number;
  ratingCount: number;
  chapterCount: number;
  author: {
    name: string;
  };
};

const NovelCard: FC<{
  details: TCard;
  isAuthorViewer?: boolean;
  referrer?: string;
  searchQuery?: string;
}> = ({ details, searchQuery, isAuthorViewer = false, referrer }) => {
  const handleStorageForAnalytics = () => {
    referrer && sessionStorage.setItem("ref", referrer);
    searchQuery && sessionStorage.setItem("searchQuery", searchQuery);
  };

  return (
    <div title={details.title} className="group relative cover-card">
      <Link
        href={`/story/${details.slug}`}
        onClick={handleStorageForAnalytics}
        className="block relative pb-2"
      >
        {details.isMature && (
          <div className="top-2 right-2 z-20 absolute">
            <Badge
              className={cn(`bg-primary text-xs`, merriweatherFont.className)}
            >
              18+
            </Badge>
          </div>
        )}

        <BlurImage
          src={details.thumbnail}
          alt={details.title}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 15vw"
        />

        <div className="mt-2 w-full">
          <h3 className="font-semibold text-slate-800 text-sm line-clamp-1">
            {details.title}
          </h3>

          {!isAuthorViewer && (
            <p className="text-gray-600 text-sm line-clamp-1">
              {details.author.name}
            </p>
          )}
        </div>
      </Link>

      <div className="hidden absolute inset-0 sm:flex flex-col">
        <div className="flex flex-col flex-1 justify-between bg-white opacity-0 group-hover:opacity-100 hover:shadow-md mb-2 p-2 border border-border/70 rounded-md transition duration-300">
          <div className="h-6">
            {details.genreSlug && (
              <Link href={`/search?genre=${details.genreSlug}`} passHref>
                <Badge
                  className="border border-border text-xs capitalize"
                  variant="secondary"
                  title={
                    details.genreSlug.charAt(0).toUpperCase() +
                    details.genreSlug.slice(1)
                  }
                >
                  {details.genreSlug}
                </Badge>
              </Link>
            )}
          </div>
          <div className="flex justify-center items-center py-4">
            <Link
              href={`/story/${details.slug}`}
              onClick={handleStorageForAnalytics}
              className="flex items-center gap-2 font-semibold text-primary hover:text-primary/80 text-sm hover:underline transition"
            >
              <span>Full Story Info</span>
              <ArrowRight02Icon size={16} />
            </Link>
          </div>

          <div className="flex justify-between items-center pb-4">
            <div className="flex flex-col items-center px-2">
              <div className="flex gap-2">
                <ViewIcon size={16} className="stroke-2 mt-1" />
              </div>
              <p className="font-semibold text-sm">
                {formatNumber(details.readCount)}
              </p>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="flex flex-col items-center px-2">
              <div className="flex gap-2">
                <StarIcon size={16} className="stroke-2 mt-1" />
              </div>
              <p className="font-semibold text-sm">
                {details.averageRating}{" "}
                <span className="text-slate-500">
                  ({Intl.NumberFormat().format(details.ratingCount)})
                </span>
              </p>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="flex flex-col items-center px-2">
              <div className="flex gap-2">
                <LeftToRightListNumberIcon
                  size={16}
                  className="stroke-2 mt-1"
                />
              </div>
              <p className="font-semibold text-sm">{details.chapterCount}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Button asChild className="gap-2 w-full">
              <Link
                href={`/story/${details.slug}`}
                onClick={handleStorageForAnalytics}
              >
                <LinkSquare02Icon size={16} className="stroke-2" />
                <span>View Details</span>
              </Link>
            </Button>
            {isAuthorViewer ? (
              <Button
                variant="outline"
                icon={AnalyticsUpIcon}
                className="gap-2 w-full"
              >
                View Analytics
              </Button>
            ) : (
              <AddToList storyId={details.id} storyTitle={details.title} />
            )}
          </div>
        </div>

        <div className="invisible mt-2 w-full">
          <h3 className="font-semibold text-slate-800 text-sm line-clamp-1">
            {details.title}
          </h3>

          {!isAuthorViewer && (
            <p className="text-gray-600 text-sm line-clamp-1">
              {details.author.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NovelCard;
