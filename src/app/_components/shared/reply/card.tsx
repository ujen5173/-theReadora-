import { HeartAddIcon, HeartRemoveIcon, RecordIcon } from "hugeicons-react";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import type { TgetReplies } from "~/server/api/routers/reviews";
import { api } from "~/trpc/react";
import ReplyForm from "./form";

const ReplyCard = ({
  reply,
  reviewId,
  onReplySuccess,
}: {
  reply: TgetReplies[number];
  reviewId: string;
  onReplySuccess: () => void;
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isLiked, setIsLiked] = useState(reply.likes?.length > 0);
  const [likesCount, setLikesCount] = useState(reply.likesCount ?? 0);

  const toggleLikeMutation = api.reviews.toggleReplyLike.useMutation({
    onMutate: () => {
      setIsLiked((prev) => !prev);
      setLikesCount((prev) => prev + (isLiked ? -1 : 1));
    },
    onError: (error) => {
      if (error.message === "UNAUTHORIZED") {
        setIsLiked(false);
        setLikesCount(reply.likesCount);
        toast.error("Sign in to like replies");
        return;
      }

      setIsLiked((prev) => !prev);
      setLikesCount((prev) => prev + (isLiked ? 1 : -1));
    },
  });

  const handleLike = async () => {
    toggleLikeMutation.mutate({ replyId: reply.id });
  };

  return (
    <div className="border p-3 rounded-lg border-border">
      <div className="flex items-start gap-3">
        <div className="relative">
          <Image
            src={reply.user.image ?? "/default-avatar.avif"}
            className="size-8 rounded-full object-cover ring-2 ring-slate-100"
            alt={reply.user.name + "Profile Image"}
            width={100}
            height={100}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h6 className="font-semibold text-slate-900">{reply.user.name}</h6>
            <RecordIcon className="size-1 fill-slate-400 text-slate-400" />
            <span className="text-xs text-slate-500">
              {new Date(reply.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <p className="text-slate-700 mt-1">{reply.reply}</p>
          {reply.parent && (
            <div className="mt-2 p-3 bg-rose-50/50 relative border border-primary/40 rounded-lg">
              <Badge className="absolute top-2 right-2" variant={"secondary"}>
                Reply to
              </Badge>
              <div className="space-y-1">
                <h6 className="text-sm font-bold text-slate-700">
                  {reply.parent.user.name}
                </h6>
                <p className="text-base text-slate-700">{reply.parent.reply}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mt-3">
            <Button
              size="sm"
              variant="link"
              onClick={handleLike}
              className={`gap-1.5 px-0 ${
                isLiked ? "text-red-500" : "hover:text-slate-700 text-slate-500"
              }`}
              icon={isLiked ? HeartRemoveIcon : HeartAddIcon}
            >
              {likesCount} Like{likesCount !== 1 ? "s" : ""}
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
          </div>

          {showReplyForm && (
            <ReplyForm
              reviewId={reviewId}
              parentId={reply.id}
              onSuccess={() => {
                setShowReplyForm(false);
                onReplySuccess();
              }}
              onCancel={() => setShowReplyForm(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReplyCard;
