"use client";

import {
  AnalyticsUpIcon,
  ArrowRight02Icon,
  LeftToRightListNumberIcon,
  LinkSquare02Icon,
  StarIcon,
  ViewIcon,
} from "hugeicons-react";
import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { cardHeight, cardWidth } from "~/utils/constants";
import { merriweatherFont } from "~/utils/font";
import { formatNumber } from "~/utils/helpers";
import AddToList from "./add-to-list";

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
  ratingAvg: number;
  ratingCount: number;
  chapterCount: number;
  author: {
    name: string;
  };
};

const NovelCard: FC<{
  details: TCard;
  isAuthorViewer?: boolean;
}> = ({ details, isAuthorViewer = false }) => {
  return (
    <div title={details.title} className="cover-card group relative">
      <Link href="/story/[slug]" as={`/story/${details.slug}`} legacyBehavior>
        <a className="relative block">
          {details.isMature && (
            <div className="absolute right-2 top-2 z-50">
              <Badge
                className={cn(`bg-primary text-xs`, merriweatherFont.className)}
              >
                18+
              </Badge>
            </div>
          )}

          <Image
            className="aspect-[1/1.5] cover-card-img mb-2 w-full rounded-lg object-fill"
            src={details.thumbnail}
            alt={details.thumbnail}
            width={cardWidth}
            height={cardHeight}
          />

          <div className="w-full">
            <h1 className="line-clamp-1 text-lg font-semibold text-slate-800 xxs:text-lg">
              {details.title}
            </h1>

            {!isAuthorViewer && (
              <p className="line-clamp-1 text-base text-gray-600">
                {details.author.name}
              </p>
            )}
          </div>
        </a>
      </Link>

      <div className="absolute inset-0 hidden flex-col sm:flex">
        <div className="mb-2 flex flex-1 flex-col justify-between rounded-md border border-border/70 bg-white p-2 opacity-0 transition duration-300 hover:shadow-md group-hover:opacity-100">
          <div className="h-6">
            {details.genreSlug && (
              <Link href={`/search?genre=${details.genreSlug}`} passHref>
                <Badge
                  className="capitalize text-xs border border-border"
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
          <div className="flex items-center justify-center py-4">
            <Link
              href={`/story/${details.slug}`}
              className="flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary/80 hover:underline"
            >
              <span>Full Story Info</span>
              <ArrowRight02Icon size={16} />
            </Link>
          </div>

          <div className="flex items-center justify-between pb-4">
            <div className="flex flex-col items-center px-2">
              <div className="flex gap-2">
                <ViewIcon size={16} className="mt-1 stroke-2" />
              </div>
              <p className="text-sm font-semibold">
                {formatNumber(details.readCount)}
              </p>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="flex flex-col items-center px-2">
              <div className="flex gap-2">
                <StarIcon size={16} className="mt-1 stroke-2" />
              </div>
              <p className="text-sm font-semibold">
                {details.ratingAvg}{" "}
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
                  className="mt-1 stroke-2"
                />
              </div>
              <p className="text-sm font-semibold">{details.chapterCount}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Button asChild className="w-full gap-2">
              <Link href={`/story/${details.slug}`}>
                <LinkSquare02Icon size={16} className="stroke-2" />
                <span>View Details</span>
              </Link>
            </Button>
            {isAuthorViewer ? (
              <Button
                variant="outline"
                icon={AnalyticsUpIcon}
                className="w-full gap-2"
              >
                View Analytics
              </Button>
            ) : (
              <AddToList storyId={details.id} />
            )}
          </div>
        </div>

        <div className="invisible w-full">
          <h1 className="line-clamp-1 text-lg font-semibold text-slate-800 xxs:text-lg">
            {details.title}
          </h1>

          {!isAuthorViewer && (
            <p className="line-clamp-1 text-base text-gray-600">
              {details.author.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NovelCard;
