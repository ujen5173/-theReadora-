"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";

const ReplyForm = ({
  reviewId,
  parentId,
  onSuccess,
  onCancel,
}: {
  reviewId: string;
  parentId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}) => {
  const utils = api.useUtils();
  const [reply, setReply] = useState("");
  const replyAReview = api.reviews.replyReview.useMutation({
    onSuccess: () => {
      setReply("");
      onSuccess();
      toast.success("Reply posted successfully");
    },
    onError: () => {
      toast.error("Failed to post reply");
    },
  });

  const handleReply = async () => {
    if (!reply.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    await replyAReview.mutateAsync({ reviewId, parentId, reply });
    utils.reviews.getReplies.refetch({
      reviewId,
    });
  };

  return (
    <div className="mt-4 space-y-3">
      <Textarea
        placeholder="Write your reply..."
        value={reply}
        autoFocus
        onChange={(e) => setReply(e.target.value)}
        className="min-h-[100px] resize-none"
      />
      <div className="flex justify-end items-center gap-2">
        <Button
          size="sm"
          disabled={replyAReview.status === "pending"}
          icon={replyAReview.status === "pending" ? Loader2 : undefined}
          iconStyle={replyAReview.status === "pending" ? "animate-spin" : ""}
          onClick={handleReply}
        >
          Post Reply
        </Button>
        <Button
          size="sm"
          disabled={replyAReview.status === "pending"}
          variant="ghost"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ReplyForm;
