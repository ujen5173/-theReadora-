"use client";

import { api } from "~/trpc/react";
import ReviewsStack from "./ReviewsStack";

const Reviews = () => {
  const { data, isLoading } = api.story.getAuthorReviews.useQuery(
    {},
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  const reviews = (data ?? []).map((r: any) => ({
    id: r.id,
    rating: r.rating,
    review: r.review,
    createdAt: r.createdAt,
    repliesCount: r.repliesCount,
    likesCount: r.likesCount,
    user: r.user ?? { id: r.userId, name: null, username: null, image: null },
    story: r.story ?? { id: r.storyId, title: "", slug: "", thumbnail: null },
  }));

  return (
    <main className="p-6">
      {isLoading ? (
        <div className="h-40 rounded-md border border-border bg-white/60 animate-pulse" />
      ) : (
        <ReviewsStack reviews={reviews} />
      )}
    </main>
  );
};

export default Reviews;
