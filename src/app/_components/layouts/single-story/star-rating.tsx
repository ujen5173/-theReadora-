"use client";

import { StarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  className?: string;
  storyId: string;
  isInteractive?: boolean;
}

export const StarRating = ({
  rating,
  maxRating = 5,
  size = 5,
  className,
  storyId,
  isInteractive = false,
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(rating);

  const rateMutation = api.story.rate.useMutation({
    onSuccess: () => {
      toast.success("Rating submitted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    setSelectedRating(rating);
  }, [rating]);

  const displayRating = hoverRating ?? selectedRating;
  const fullStars = Math.floor(displayRating);
  const hasHalfStar = displayRating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  const handleStarClick = (index: number) => {
    console.log("clicked");
    if (!isInteractive) return;

    const newRating = index + 1;
    setSelectedRating(newRating);
    rateMutation.mutate({ storyId, rating: newRating });
  };

  const handleStarHover = (index: number) => {
    console.log({ index, isInteractive });
    if (!isInteractive) return;
    setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    if (!isInteractive) return;
    setHoverRating(null);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-0.5",
        isInteractive && "cursor-pointer",
        className
      )}
      onMouseLeave={handleMouseLeave}
    >
      {[...Array(maxRating)].map((_, i) => {
        const isFull = i < fullStars;
        const isHalf = i === fullStars && hasHalfStar;
        const isHovered = hoverRating !== null && i < hoverRating;

        return (
          <div
            key={i}
            className={cn(
              "relative",
              isInteractive && "transition-transform hover:scale-110"
            )}
            onClick={() => handleStarClick(i)}
            onMouseEnter={() => handleStarHover(i)}
          >
            {isFull ? (
              <StarIcon
                className={cn(
                  "size-5 fill-yellow-400 text-yellow-400",
                  isHovered && "fill-yellow-500 text-yellow-500"
                )}
              />
            ) : isHalf ? (
              <div className="relative size-5">
                <StarIcon
                  className={cn(
                    "absolute size-5 fill-yellow-400 text-yellow-400",
                    isHovered && "fill-yellow-500 text-yellow-500"
                  )}
                />
                <div className="absolute right-0 top-0 h-full w-1/2 overflow-hidden">
                  <StarIcon
                    className={cn(
                      "size-5 fill-white text-yellow-400",
                      isHovered && "text-yellow-500"
                    )}
                  />
                </div>
              </div>
            ) : (
              <StarIcon
                className={cn(
                  "size-5 text-yellow-400",
                  isHovered && "text-yellow-500"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
