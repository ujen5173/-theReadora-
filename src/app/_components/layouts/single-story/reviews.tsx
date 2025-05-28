"use client";
import { RecordIcon, StarIcon } from "hugeicons-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { useStoryRating } from "~/store/useStoryRating";
import { api } from "~/trpc/react";
import ReviewCard from "../../shared/review-card";

export type TReview = {
  id: string;
  rating: number;
  review: string | null;
  createdAt: Date;
  repliesCount: number;
  likesCount: number;
  likes: {
    id: string;
  }[];
  user: {
    id: string;
    name: string;
    username: string;
    image: string | null;
  };
};

const Reviews = ({ storyId }: { storyId: string }) => {
  const { setAverageRating, setRatingCount } = useStoryRating();
  const { data: reviewMeta, isLoading: isReviewMetaLoading } =
    api.reviews.getMeta.useQuery(
      {
        storyId,
      },
      {
        refetchOnWindowFocus: false,
      }
    );

  useEffect(() => {
    if (reviewMeta) {
      setAverageRating(reviewMeta.averageRating);
      setRatingCount(reviewMeta.ratingCount);
    }
  }, [reviewMeta]);

  const [sortBy, setSortBy] = useState<
    "LATEST" | "OLDEST" | "MOST_VOTES" | "TOP"
  >("TOP");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = api.reviews.getReviews.useQuery(
    {
      storyId,
      sortBy,
      skip: (page - 1) * pageSize,
      limit: pageSize,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const handleSortChange = (value: string) => {
    setSortBy(value as typeof sortBy);
    setPage(1);
  };

  return (
    <div className="">
      <div className="flex justify-between items-start md:items-center mb-4">
        <div className="flex flex-col md:flex-row justify-center md:justify-normal md:items-center gap-2">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Reviews
          </h2>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {isReviewMetaLoading ? (
                <Skeleton className="w-20" />
              ) : (
                [1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    size={20}
                    className={
                      star <= Math.round(reviewMeta!.averageRating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-transparent text-amber-400"
                    }
                  />
                ))
              )}
            </div>

            {!isReviewMetaLoading && (
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-slate-700">
                  {reviewMeta!.averageRating.toFixed(1)}
                </span>
                <RecordIcon className="size-1 fill-slate-700" />
                <span className="text-slate-600">
                  {reviewMeta!.ratingCount} reviews
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="hidden sm:block">
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="bg-white w-[150px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort By</SelectLabel>
                <SelectItem value="LATEST">Latest</SelectItem>
                <SelectItem value="OLDEST">Oldest</SelectItem>
                <SelectItem value="MOST_VOTES">Most Votes</SelectItem>
                <SelectItem value="TOP">Top</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="max-w-sm mx-auto space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              <p className="text-slate-500">Loading reviews...</p>
            </div>
          </div>
        ) : (data ?? []).length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-sm mx-auto space-y-3">
              <StarIcon
                size={24}
                className="text-yellow-400 fill-yellow-400 mx-auto"
              />
              <h3 className="text-lg font-medium text-slate-900">
                No Reviews Yet
              </h3>
              <p className="text-slate-500">
                Be the first to share your thoughts about this story
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            {((data ?? []).length > 4 ? data?.slice(0, -1) : data)?.map(
              (review) => (
                <div
                  key={review.id}
                  className="border-b border-border last:border-0"
                >
                  <ReviewCard review={review} />
                </div>
              )
            )}
          </div>
        )}
      </div>

      {(data ?? []).length > 4 && (
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/90 hover:bg-primary/5"
          >
            Load All Reviews
          </Button>
        </div>
      )}
    </div>
  );
};

export default Reviews;
