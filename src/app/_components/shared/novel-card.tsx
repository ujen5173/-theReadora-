"use client";

import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { merriweatherFont } from "~/utils/font";
import { formatNumber, makeSlug } from "~/utils/helpers";
import {
  ArrowRight02Icon,
  FavouriteIcon,
  LeftToRightListNumberIcon,
  LinkSquare02Icon,
  ViewIcon,
} from "hugeicons-react";
import { cardHeight, cardWidth } from "~/utils/constants";
import { PlusIcon } from "lucide-react";

type TCard = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  votes: number;
  reads: number;
  readingTime: number;
  thumbnail: string;
  tags: string[];
  isMature: boolean;
  isCompleted: boolean;
  genreSlug: string;

  chapters: ChapterCard[];
  author: {
    name: string | null;
    username: string | null;
  };
};

type ChapterCard = {
  id: string;
  title: string | null;
  slug: string | null;
  isPremium: boolean;
  chapterNumber: number;
  createdAt: Date;
};

const NovelCard: FC<{
  details: TCard;
}> = ({ details }) => {
  return (
    <div className="cover-card group relative">
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
            className="cover-card-img mb-2 rounded-lg object-fill"
            src={details.thumbnail}
            alt={details.thumbnail}
            width={cardWidth}
            height={cardHeight}
            style={{
              aspectRatio: "1/1.5",
            }}
          />

          <div className="w-full">
            <h1 className="line-clamp-1 text-lg font-semibold text-slate-800 xxs:text-lg">
              {details.title}
            </h1>

            <p className="line-clamp-1 text-base text-gray-600">
              {details.author.name}
            </p>
          </div>
        </a>
      </Link>

      <div className="absolute inset-0 hidden flex-col sm:flex">
        <div className="mb-2 flex flex-1 flex-col justify-between rounded-md border border-border/70 bg-white p-2 opacity-0 transition duration-300 hover:shadow-md group-hover:opacity-100">
          <div className="h-6">
            {details.genreSlug && (
              <Link href={`/genre/${makeSlug(details.genreSlug)}`} passHref>
                <Badge className="border border-border" variant="secondary">
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
                {formatNumber(details.reads)}
              </p>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="flex flex-col items-center px-2">
              <div className="flex gap-2">
                <FavouriteIcon size={16} className="mt-1 stroke-2" />
              </div>
              <p className="text-sm font-semibold">
                {formatNumber(details.votes)}
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
              <p className="text-sm font-semibold">
                {(details?.chapters ?? []).length}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Button asChild className="w-full gap-2">
              <Link target="_blank" href={`/story/${details.slug}`}>
                <LinkSquare02Icon size={16} className="stroke-2" />
                <span>View Details</span>
              </Link>
            </Button>
            <Button variant="secondary" className="w-full gap-2">
              <PlusIcon size={16} className="stroke-2" />
              <span>Add to List</span>
              {/* {!(removingTail || removing) ? (
                <MinusSignSquareIcon size={16} className="stroke-2" />
              ) : (
                <Loading03Icon
                  className={cn("animate-spin size-4 text-slate-600")}
                />
              )}
              <span>Remove from List</span> */}
            </Button>
          </div>
        </div>

        <div className="invisible w-full">
          <h1 className="line-clamp-1 text-lg font-semibold text-slate-800 xxs:text-lg">
            {details.title}
          </h1>

          <p className="line-clamp-1 text-base text-gray-600">
            {details.author.name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NovelCard;
