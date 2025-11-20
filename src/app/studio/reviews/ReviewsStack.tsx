import { InboxCheckIcon } from "hugeicons-react";
import { Button } from "~/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { ScrollArea } from "~/components/ui/scroll-area";
import { api } from "~/trpc/react";
import type useReview from "../hooks/useReview";
import ReviewCard from "./ReviewCard";
import ReviewFilters from "./ReviewFilters";

export type ReviewItem = {
  id: string;
  rating: number;
  review: string | null;
  createdAt: Date;
  repliesCount: number;
  likesCount: number;
  user: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
  story: {
    id: string;
    title: string;
    slug: string;
    thumbnail: string | null;
  };
  hasAuthorLike: boolean;
};

const ReviewsStack = ({
  reviews,
  authorWorkTitle,
  setMetrics,
  applyMetrics,
  metrics,
  loadMore,
  hasMore,
  isLoading,
  isLoadingFilters,
  totalCount,
  currentCount,
  resetFilters,
}: {
  reviews: ReviewItem[];
  authorWorkTitle: ReturnType<typeof useReview>["authorWorkTitle"];
  setMetrics: ReturnType<typeof useReview>["setMetrics"];
  applyMetrics: ReturnType<typeof useReview>["applyMetrics"];
  metrics: ReturnType<typeof useReview>["metrics"];
  loadMore: ReturnType<typeof useReview>["loadMore"];
  hasMore: ReturnType<typeof useReview>["hasMore"];
  isLoading: ReturnType<typeof useReview>["isLoading"];
  isLoadingFilters: boolean;
  totalCount: ReturnType<typeof useReview>["totalCount"];
  currentCount: ReturnType<typeof useReview>["currentCount"];
  resetFilters: ReturnType<typeof useReview>["resetFilters"];
}) => {
  const { mutate } = api.reviews.toggleLike.useMutation();

  const likeReview = (id: string) =>
    mutate({
      reviewId: id,
    });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <ReviewFilters
          authorWorkTitle={authorWorkTitle}
          setMetrics={setMetrics}
          applyMetrics={applyMetrics}
          metrics={metrics}
          resetFilters={resetFilters}
        />

        <ScrollArea className="max-h-[80dvh] bg-white border border-border rounded-md w-full">
          <div className="space-y-4 p-4 flex flex-col justify-center">
            {isLoadingFilters ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-lg font-semibold text-foreground animate-pulse">
                    Crunching the data...
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Fetching your reviews
                  </p>
                </div>
              </div>
            ) : (
              <>
                {reviews.map((review) => (
                  <ReviewCard
                    review={review}
                    key={review.id}
                    likeReview={likeReview}
                  />
                ))}

                {reviews.length === 0 && (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia className="border border-border" variant="icon">
                        <InboxCheckIcon />
                      </EmptyMedia>
                      <EmptyTitle>No reviews yet</EmptyTitle>
                      <EmptyDescription>
                        Your stories haven't caught any reviews yet. Keep writing,
                        improving, and getting your stories out there.{" "}
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}

                {reviews.length > 0 && (
                  <div className="flex flex-col items-center gap-3 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Showing {currentCount} of {totalCount} reviews
                    </p>
                    {hasMore && (
                      <Button
                        onClick={loadMore}
                        variant="outline"
                        disabled={isLoading}
                        className="w-full max-w-xs"
                      >
                        {isLoading ? "Loading more..." : "Load More"}
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default ReviewsStack;
