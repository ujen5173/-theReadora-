import {
  HeartAddIcon,
  HeartCheckIcon,
  MoreVerticalIcon,
  RecordIcon,
  StarIcon,
  ViewIcon,
  ViewOffIcon,
} from "hugeicons-react";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const Reviews = ({
  storyId,
  reviews,
  ratingDetails,
}: {
  storyId: string;
  reviews: {
    id: string;
    rating: number;
    review: string | null;
    createdAt: Date;
    updatedAt: Date;
    spoiler?: false;
    user: {
      image: string | null;
      username: string;
      name: string;
      id: string;
    };
  }[];
  ratingDetails: {
    count: number;
    average: number;
  };
}) => {
  console.log({ ratingDetails });
  const [revealedSpoilers, setRevealedSpoilers] = useState<string[]>([]);
  const [likedReviews, setLikedReviews] = useState<string[]>([]);
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);

  const toggleSpoiler = (id: string) => {
    if (revealedSpoilers.includes(id)) {
      setRevealedSpoilers(revealedSpoilers.filter((item) => item !== id));
    } else {
      setRevealedSpoilers([...revealedSpoilers, id]);
    }
  };

  const toggleLike = (id: string) => {
    if (likedReviews.includes(id)) {
      setLikedReviews(likedReviews.filter((item) => item !== id));
    } else {
      setLikedReviews([...likedReviews, id]);
    }
  };

  const handleReply = (id: string) => {
    setShowReplyForm(showReplyForm === id ? null : id);
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Reviews
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  size={20}
                  className={
                    star <= Math.round(ratingDetails.average)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-transparent text-amber-400"
                  }
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-slate-700">
                {ratingDetails.average.toFixed(1)}
              </span>
              <RecordIcon className="size-1 fill-slate-700" />
              <span className="text-slate-600">
                {ratingDetails.count} reviews
              </span>
            </div>
          </div>
        </div>
        <Select defaultValue="TOP">
          <SelectTrigger className="bg-white w-[150px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort By</SelectLabel>
              <SelectItem value="LATEST">Latest</SelectItem>
              <SelectItem value="OLDERS">Oldest</SelectItem>
              <SelectItem value="MOST_VOTES">Most Votes</SelectItem>
              <SelectItem value="TOP">Top</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        {reviews.length === 0 && (
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
        )}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          {reviews.map((review) => (
            <div key={review.id}>
              <div className="p-4">
                {/* Header with user info and rating */}
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
                      <h6 className="font-semibold text-slate-900">
                        {review.user.name}
                      </h6>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-0.5">
                          {Array(review.rating)
                            .fill("")
                            .map((_, i) => (
                              <StarIcon
                                key={i}
                                size={14}
                                className="fill-amber-400 text-amber-400"
                              />
                            ))}
                          {Array(5 - review.rating)
                            .fill("")
                            .map((_, i) => (
                              <StarIcon
                                key={i}
                                size={14}
                                className="fill-transparent text-amber-400"
                              />
                            ))}
                        </div>
                        <RecordIcon className="size-1 fill-slate-400" />
                        <span className="text-xs text-slate-500">
                          {review.createdAt.toLocaleDateString("en-US", {
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
                        <MoreVerticalIcon className="size-4 text-slate-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                        Report Abuse
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Review Content */}
                <div className="pl-13">
                  {review.spoiler && !revealedSpoilers.includes(review.id) ? (
                    <div className="relative">
                      <div className="backdrop-blur-md px-3 py-2 bg-slate-50 rounded-lg">
                        <p className="text-transparent select-none">
                          {review.review}
                        </p>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="backdrop-blur-sm border-border shadow-sm hover:bg-white/80"
                          onClick={() => toggleSpoiler(review.id)}
                          icon={ViewIcon}
                        >
                          Reveal Spoiler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="group relative">
                      <p className="text-slate-700 leading-relaxed">
                        {review.review}
                      </p>
                      {review.spoiler && (
                        <div className="absolute -right-2 -top-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-500 gap-1 hover:text-slate-700 hover:bg-slate-100"
                            onClick={() => toggleSpoiler(review.id)}
                            title="Hide spoiler"
                            icon={ViewOffIcon}
                          >
                            Hide
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-4 mt-3 border-b last:border-0 border-border">
                    <Button
                      variant="link"
                      size="sm"
                      className="text-slate-500 gap-1.5 hover:text-slate-700 px-0"
                      onClick={() => toggleLike(review.id)}
                    >
                      {likedReviews.includes(review.id) ? (
                        <HeartCheckIcon className="size-4 text-red-500" />
                      ) : (
                        <HeartAddIcon className="size-4" />
                      )}
                      <span>Like</span>
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-slate-500 gap-1.5 hover:text-slate-700 px-0"
                      onClick={() => handleReply(review.id)}
                    >
                      <MessageCircle className="size-4" />
                      <span>Reply</span>
                    </Button>
                  </div>

                  {/* Reply Form */}
                  {showReplyForm === review.id && (
                    <div className="mt-3">
                      <textarea
                        className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none bg-slate-50"
                        placeholder="Write your reply..."
                        rows={2}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowReplyForm(null)}
                          className="hover:bg-slate-100"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                        >
                          Post Reply
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center">
        <Button
          variant="ghost"
          className="text-primary hover:text-primary/90 hover:bg-primary/5"
        >
          View All reviews
        </Button>
      </div>
    </div>
  );
};

export default Reviews;
