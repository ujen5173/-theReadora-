"use client";

import {
  HeartAddIcon,
  HeartRemoveIcon,
  RecordIcon,
  StarIcon,
} from "hugeicons-react";
import { MessageCircle, MoreVertical } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";
import type { TReview } from "../layouts/single-story/reviews";
import ReplyCard from "./reply/card";
import ReplyForm from "./reply/form";

const ReviewCard = ({ review }: { review: TReview }) => {
  const [isLiked, setIsLiked] = useState(review.likes?.length > 0);
  const [likesCount, setLikesCount] = useState(review.likesCount);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const {
    data: replies,
    isLoading,
    refetch,
  } = api.reviews.getReplies.useQuery({ reviewId: review.id });

  const toggleLikeMutation = api.reviews.toggleLike.useMutation({
    onMutate: () => {
      setIsLiked((prev) => !prev);
      setLikesCount((prev) => prev + (isLiked ? -1 : 1));
    },
    onError: (error) => {
      if (error.message === "UNAUTHORIZED") {
        setIsLiked(false);
        setLikesCount(review.likesCount);
        toast.error("Sign in to like reviews");
        return;
      }

      setIsLiked((prev) => !prev);
      setLikesCount((prev) => prev + (isLiked ? 1 : -1));
    },
  });

  const handleLike = async () => {
    toggleLikeMutation.mutate({ reviewId: review.id });
  };

  return (
    <div className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Image
              src={review.user.image ?? "/default-avatar.avif"}
              className="size-10 rounded-full object-cover ring-2 ring-slate-100"
              alt={review.user.name + "Profile Image"}
              width={100}
              height={100}
            />
          </div>
          <div>
            <h6 className="font-semibold text-slate-900">{review.user.name}</h6>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-0.5">
                {Array(Number(review.rating) ?? 0)
                  .fill("")
                  .map((_, i) => (
                    <StarIcon
                      key={i}
                      size={14}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                {Array(5 - (Number(review.rating) ?? 0))
                  .fill("")
                  .map((_, i) => (
                    <StarIcon
                      key={i}
                      size={14}
                      className="fill-transparent text-amber-400"
                    />
                  ))}
              </div>
              <RecordIcon className="size-1 fill-slate-400 text-slate-400" />
              <span className="text-xs text-slate-500">
                {new Date(review.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-slate-100"
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
              Report Abuse
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-2">
        <p className="text-slate-700 leading-relaxed">{review.review}</p>
      </div>

      <div className="flex items-center gap-4 mt-3 border-b last:border-0 border-border">
        <Button
          size="sm"
          variant="link"
          onClick={handleLike}
          className={`gap-1.5 px-0 ${
            isLiked ? "text-red-500" : "hover:text-slate-700 text-slate-500"
          }`}
          icon={isLiked ? HeartRemoveIcon : HeartAddIcon}
        >
          {likesCount} Like{likesCount > 1 ? "s" : ""}
        </Button>
        <Button
          size="sm"
          variant="link"
          onClick={() => setShowReplyForm((prev) => !prev)}
          className="text-slate-500 gap-1.5 hover:text-slate-700 px-0"
          icon={MessageCircle}
        >
          <span>Reply</span>
        </Button>
        {isLoading ? (
          <Skeleton className="h-5 w-20 rounded-md" />
        ) : (
          (replies ?? []).length > 0 && (
            <Button
              size="sm"
              variant="link"
              onClick={() => setShowReplies((prev) => !prev)}
              className="underline text-slate-500 gap-1.5 hover:text-primary px-0"
            >
              <span>View {(replies ?? []).length} replies</span>
            </Button>
          )
        )}
      </div>

      {showReplies && (
        <div className="mt-4 space-y-4">
          {replies?.length === 0 ? (
            <div className="text-center text-slate-500">No replies yet</div>
          ) : (
            replies?.map((reply) => (
              <ReplyCard
                key={reply.id}
                reply={reply}
                reviewId={review.id}
                onReplySuccess={() => refetch()}
              />
            ))
          )}
        </div>
      )}

      {showReplyForm && (
        <ReplyForm
          reviewId={review.id}
          onSuccess={() => {
            setShowReplyForm(false);
            refetch();
          }}
          onCancel={() => setShowReplyForm(false)}
        />
      )}
    </div>
  );
};

export default ReviewCard;
