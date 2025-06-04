"use client";
import { StarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import HalfStar from "~/assets/svgs/half-star";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

interface StarRatingProps {
  removeStars?: boolean;
  rating: number;
  maxRating?: number;
  className?: string;
  storyId: string;
  isInteractive?: boolean;
}

const ratingEmojis = ["😫", "😕", "😐", "😊", "🤩"];

export const StarRating = ({
  removeStars = false,
  rating,
  maxRating = 5,
  className,
  storyId,
  isInteractive = false,
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(rating);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogHoverRating, setDialogHoverRating] = useState<number | null>(
    null
  );

  const rateMutation = api.story.rate.useMutation({
    onSuccess: () => {
      toast.success("Thank you for your review!");
      setIsDialogOpen(false);
      setReview("");
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(error.message);
      setIsSubmitting(false);
    },
  });

  useEffect(() => {
    setSelectedRating(rating);
  }, [rating]);

  const displayRating = hoverRating ?? selectedRating;
  const dialogDisplayRating = dialogHoverRating ?? selectedRating;

  const handleStarClick = (index: number) => {
    if (!isInteractive) return;

    const newRating = index + 1;
    setSelectedRating(newRating);
    setIsDialogOpen(true);
  };

  const handleStarHover = (index: number) => {
    if (!isInteractive) return;
    setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    if (!isInteractive) return;
    setHoverRating(null);
  };

  const handleDialogStarHover = (index: number) => {
    setDialogHoverRating(index + 1);
  };

  const handleDialogMouseLeave = () => {
    setDialogHoverRating(null);
  };

  const utils = api.useUtils();

  const handleSubmitReview = async () => {
    if (!review.trim()) {
      toast.error("Please write a review before submitting");
      return;
    }
    setIsSubmitting(true);
    await rateMutation.mutateAsync({
      storyId,
      rating: selectedRating,
      review,
    });
    Promise.all([
      utils.reviews.getReviews.refetch({
        storyId,
      }),
      utils.reviews.getMeta.refetch({
        storyId,
      }),
    ]);
  };

  const getRatingEmoji = (rating: number) => {
    return ratingEmojis[Math.floor(rating) - 1] || "";
  };

  const renderStars = (isDialog: boolean = false) => {
    const currentHoverRating = isDialog ? dialogHoverRating : hoverRating;
    const currentDisplayRating = isDialog ? dialogDisplayRating : displayRating;
    const currentFullStars = Math.floor(currentDisplayRating);
    const currentHasHalfStar = currentDisplayRating % 1 >= 0.5;
    const starSize = isDialog ? "size-7" : "size-5";

    if (removeStars) {
      return "Add Rating";
    }

    return [...Array(maxRating)].map((_, i) => {
      const isFull = i < currentFullStars;
      const isHalf = i === currentFullStars && currentHasHalfStar;
      const isHovered = currentHoverRating !== null && i < currentHoverRating;

      return (
        <div
          key={i}
          className={cn(
            "relative group flex items-center",
            isDialog && "transition-all duration-300 hover:scale-125",
            !isDialog &&
              isInteractive &&
              "transition-all duration-200 hover:scale-110"
          )}
          onClick={
            isDialog ? () => setSelectedRating(i + 1) : () => handleStarClick(i)
          }
          onMouseEnter={
            isDialog ? () => handleDialogStarHover(i) : () => handleStarHover(i)
          }
        >
          {isFull ? (
            <StarIcon
              className={cn(
                starSize,
                "fill-yellow-400 text-yellow-400 transition-all duration-300",
                isHovered && "fill-yellow-500 text-yellow-500",
                "group-hover:fill-yellow-500 group-hover:text-yellow-500",
                isDialog && "group-hover:rotate-12"
              )}
            />
          ) : isHalf ? (
            <HalfStar
              className={cn(
                "fill-yellow-400 text-yellow-400 transition-all duration-300",
                isHovered && "fill-yellow-500 text-yellow-500",
                "group-hover:fill-yellow-500 group-hover:text-yellow-500",
                isDialog && "group-hover:rotate-12"
              )}
            />
          ) : (
            <StarIcon
              className={cn(
                starSize,
                "text-yellow-400 transition-all duration-300",
                isHovered && "text-yellow-500",
                "group-hover:text-yellow-500",
                isDialog && "group-hover:rotate-12"
              )}
            />
          )}
        </div>
      );
    });
  };

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-0.5",
          isInteractive && "cursor-pointer",
          className
        )}
        onMouseLeave={handleMouseLeave}
      >
        {renderStars()}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Write a Review
            </DialogTitle>
            <DialogDescription>
              Share your thoughts about this story
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <div
                className="flex items-center gap-3"
                onMouseLeave={handleDialogMouseLeave}
              >
                <div className="flex items-center gap-1">
                  {renderStars(true)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium">
                    {getRatingEmoji(selectedRating)}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="What did you like or dislike about this story? Share your thoughts..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="min-h-[120px] resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Your review helps other readers make informed decisions
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={isSubmitting || !review.trim()}
              className="min-w-[100px]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Submitting...</span>
                </div>
              ) : (
                "Submit Review"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
