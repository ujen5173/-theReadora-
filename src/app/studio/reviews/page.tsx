"use client";

import useReview from "../hooks/useReview";
import ReviewsStack from "./ReviewsStack";

const Reviews = () => {
  const reviewData = useReview();
  const {
    isLoading,
    r,
    loadMore,
    hasMore,
    totalCount,
    currentCount,
    resetFilters,
  } = reviewData;

  const isLoadingFilters = isLoading && r.length === 0;
  const isLoadingMore = isLoading && r.length > 0;

  return (
    <main className="p-4 sm:p-6">
      <ReviewsStack
        reviews={r}
        authorWorkTitle={reviewData.authorWorkTitle}
        setMetrics={reviewData.setMetrics}
        applyMetrics={reviewData.applyMetrics}
        metrics={reviewData.metrics}
        loadMore={loadMore}
        hasMore={hasMore}
        isLoading={isLoadingMore}
        isLoadingFilters={isLoadingFilters}
        totalCount={totalCount}
        currentCount={currentCount}
        resetFilters={resetFilters}
      />
    </main>
  );
};

export default Reviews;
