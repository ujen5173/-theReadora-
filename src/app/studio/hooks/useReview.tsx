"use client";

import { useMemo, useState } from "react";
import { api } from "~/trpc/react";

const useReview = () => {
  const [selectedWork, setSelectedWork] = useState<string>();
  const [ratings, setRatings] = useState<number | null>(null);
  const [sorting, setSorting] = useState<
    "ALL" | "MOST_LIKED" | "LATEST" | "OLDEST"
  >("ALL");
  const [query, setQuery] = useState<string>("");
  const [skip, setSkip] = useState(0);
  const limit = 20;

  const [appliedFilters, setAppliedFilters] = useState<{
    rating?: number;
    selectedWork?: string;
    sorting?: Exclude<typeof sorting, "ALL">;
    query?: string;
  }>({});

  const queryInput = useMemo(
    () => ({
      rating: appliedFilters.rating,
      selectedWork: appliedFilters.selectedWork,
      sorting: appliedFilters.sorting,
      query: appliedFilters.query,
      limit,
      skip,
    }),
    [appliedFilters, skip]
  );

  const { data, isLoading, refetch } = api.reviews.getAuthorReviews.useQuery(
    queryInput,
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  const r = ((data?.reviews ?? []) as any[]).map((r: any) => ({
    id: r.id,
    rating: r.rating,
    review: r.review,
    createdAt: r.createdAt,
    repliesCount: r.repliesCount,
    likesCount: r.likesCount,
    user: r.user ?? { id: r.userId, name: null, username: null, image: null },
    story: r.story ?? { id: r.storyId, title: "", slug: "", thumbnail: null },
    hasAuthorLike: r.hasAuthorLike,
  }));

  const { data: authorWorkTitle } = api.story.getAuthorWorkTitle.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  );

  const setMetrics = ({
    srt,
    selected,
    ratings: nextRating,
    query: nextQuery,
  }: {
    srt?: typeof sorting;
    selected?: typeof selectedWork;
    ratings?: number | null;
    query?: string;
  }) => {
    if (typeof nextRating !== "undefined") {
      setRatings(nextRating);
    }

    if (typeof selected !== "undefined") {
      setSelectedWork(selected);
    }

    if (typeof srt !== "undefined") {
      setSorting(srt);
    }

    if (typeof nextQuery !== "undefined") {
      setQuery(nextQuery);
    }
  };

  const buildAppliedFilters = () => ({
    rating: ratings ?? undefined,
    selectedWork: selectedWork ?? undefined,
    sorting: sorting === "ALL" ? undefined : sorting,
    query: query || undefined,
  });

  const applyMetrics = () => {
    const nextFilters = buildAppliedFilters();

    setAppliedFilters((prev) => {
      const isSame =
        prev.rating === nextFilters.rating &&
        prev.selectedWork === nextFilters.selectedWork &&
        prev.sorting === nextFilters.sorting &&
        prev.query === nextFilters.query;

      if (isSame) {
        void refetch();
        return prev;
      }

      // Reset pagination when filters change
      setSkip(0);
      return nextFilters;
    });
  };

  const resetFilters = () => {
    setSelectedWork(undefined);
    setRatings(null);
    setSorting("ALL");
    setQuery("");
    setSkip(0);
    setAppliedFilters({});
  };

  const loadMore = () => {
    setSkip((prev) => prev + limit);
  };

  const hasMore = (data?.totalCount ?? 0) > skip + limit;

  return {
    r,
    isLoading,
    authorWorkTitle,
    setMetrics,
    applyMetrics,
    resetFilters,
    loadMore,
    hasMore,
    totalCount: data?.totalCount ?? 0,
    currentCount: skip + r.length,
    metrics: {
      selectedWork,
      ratings,
      sorting,
      query,
    },
  };
};

export default useReview;
