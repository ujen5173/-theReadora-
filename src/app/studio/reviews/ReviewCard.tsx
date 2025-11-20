"use client";

import {
  Comment01Icon,
  FavouriteIcon,
  PinIcon,
  StarIcon,
} from "hugeicons-react";
import {
  BookOpenIcon,
  Dot,
  MoreHorizontalIcon,
  ReplyIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import BlurImage from "~/app/_components/shared/blur-image";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { formatDate } from "~/utils/helpers";
import type { ReviewItem } from "./ReviewsStack";

const ReviewCard = ({
  review,
  likeReview,
}: {
  review: ReviewItem;
  likeReview: (id: string) => void;
}) => {
  const [liked, setLiked] = useState({
    status: review.hasAuthorLike,
    count: review.likesCount,
  });
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const { mutate: pinReview } = api.reviews.pinReview.useMutation({
    onSuccess: () => {
      setIsPinned((prev) => !prev);
    },
  });

  const { mutate: submitReply, isPending: isSubmittingReply } =
    api.reviews.replyReview.useMutation({
      onSuccess: () => {
        setReplyText("");
        setShowReplyInput(false);
        setShowReplies(true);
        void repliesQuery.refetch();
      },
    });

  const repliesQuery = api.reviews.getReplies.useQuery(
    { reviewId: review.id },
    { enabled: showReplies }
  );

  const handlePinToggle = () => {
    pinReview({
      reviewId: review.id,
      status: !isPinned,
    });
  };

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      submitReply({
        reviewId: review.id,
        reply: replyText.trim(),
      });
    }
  };

  return (
    <div
      key={review.id}
      className="border-b border-border last:border-0 pb-4 last:pb-0 flex gap-6 relative border-0"
    >
      <div className="flex-1">
        <div className="relative pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12 ring-2 ring-background shadow-sm">
                <AvatarImage
                  src={review.user.image ?? undefined}
                  alt={review.user.name ?? "Reviewer"}
                />
                <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-primary/20 to-primary/10">
                  {(review.user.name ?? "?")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <Link href={`/profile?user=${review.user.username ?? "user"}`}>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">
                      {review.user.name ?? "Unknown"}
                    </h4>
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      @{review.user.username ?? "user"}
                    </Badge>
                  </div>
                </Link>

                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpenIcon className="h-3.5 w-3.5" />
                    {formatDate(new Date(review.createdAt))}
                  </span>
                  <Dot />
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-foreground">{review.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="min-h-[52px]">
            <p className="text-foreground leading-relaxed">{review.review}</p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                onClick={() => {
                  likeReview(review.id);
                  setLiked((prev) => ({
                    count: prev.status ? prev.count - 1 : prev.count + 1,
                    status: !prev.status,
                  }));
                }}
                size="sm"
                className={cn(
                  liked.status
                    ? "bg-red-500 border-red-400 text-white"
                    : "text-muted-foreground hover:bg-red-50 hover:border-red-200 hover:text-red-600",
                  "h-9 gap-2 rounded-full px-3 transition-all"
                )}
              >
                <FavouriteIcon className="h-4 w-4" />
                <span className="text-sm font-medium">{liked.count}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplies(!showReplies)}
                className="h-9 gap-2 rounded-full px-3 text-muted-foreground transition-all hover:bg-blue-50 hover:text-blue-600"
              >
                <Comment01Icon className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {review.repliesCount}
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="h-9 gap-2 rounded-full px-3 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
              >
                <ReplyIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Reply</span>
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <DropdownMenu>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full p-0 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  asChild
                >
                  <DropdownMenuTrigger>
                    <MoreHorizontalIcon className="h-4 w-4" />
                  </DropdownMenuTrigger>
                </Button>
                <DropdownMenuContent align="end" className="p-0">
                  <Button
                    size="sm"
                    variant={"outline"}
                    className="w-full"
                    onClick={handlePinToggle}
                  >
                    <PinIcon className="h-4 w-4" />
                    {isPinned ? "Unpin Review" : "Pin Review"}
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Reply Input */}
          {showReplyInput && (
            <div className="mt-4 space-y-2 bg-muted/30 p-3 rounded-md">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply..."
                className="w-full min-h-[80px] p-2 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowReplyInput(false);
                    setReplyText("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleReplySubmit}
                  disabled={!replyText.trim() || isSubmittingReply}
                >
                  {isSubmittingReply ? "Submitting..." : "Submit Reply"}
                </Button>
              </div>
            </div>
          )}

          {/* Replies List */}
          {showReplies && repliesQuery.data && repliesQuery.data.length > 0 && (
            <div className="mt-4 space-y-3 border-l-2 border-border pl-4">
              {repliesQuery.data.map((reply) => (
                <div key={reply.id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={reply.user.image ?? undefined} />
                      <AvatarFallback className="text-xs">
                        {(reply.user.name ?? "?")[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {reply.user.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @{reply.user.username}
                    </span>
                  </div>
                  <p className="text-sm text-foreground pl-8">{reply.reply}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div>
        <Link href={`/story/${review.story.slug}`} target="_blank">
          <Tooltip>
            <TooltipTrigger>
              <div role="button" className="cursor-pointer mt-2 w-24">
                <BlurImage
                  src={review.story.thumbnail ?? ""}
                  alt={review.story.title}
                  className="aspect-[1/1.6] w-full rounded-sm border border-gray-200 flex-shrink-0"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent variant="outline">
              <p>{review.story.title}</p>
            </TooltipContent>
          </Tooltip>
        </Link>
      </div>
    </div>
  );
};

export default ReviewCard;
