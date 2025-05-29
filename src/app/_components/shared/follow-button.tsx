"use client";

import { UserAdd01Icon, UserRemove01Icon } from "hugeicons-react";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

const FollowButton = ({
  followingTo,
}: {
  followingTo: {
    id?: string;
    name?: string;
  };
}) => {
  const { data: isUserFollowing, isLoading } = api.user.followStatus.useQuery(
    {
      followingId: followingTo.id as string,
    },
    {
      enabled: !!followingTo?.id,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  const { data, mutateAsync, status, error } = api.user.follow.useMutation();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setIsFollowing(!!isUserFollowing);
  }, [isUserFollowing, followingTo?.id]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
      setIsFollowing(!isFollowing);
      return;
    }

    if (status === "success") {
      toast.success(
        data.isFollowing
          ? `Started following ${followingTo?.name}`
          : `Unfollowed ${followingTo?.name}`
      );
    }
  }, [status, error, followingTo?.id]);

  const handleFollow = async () => {
    if (!followingTo?.id) {
      toast.error("Author ID is required");
      return;
    }

    setIsFollowing((prev) => !prev);

    try {
      await mutateAsync({ followingId: followingTo.id });
    } catch (error) {
      toast.error("Error following user");
    }
  };

  return (
    <Button
      onClick={handleFollow}
      variant="default"
      size="sm"
      icon={
        isLoading || status === "pending"
          ? Loader2Icon
          : isFollowing
          ? UserRemove01Icon
          : UserAdd01Icon
      }
      iconStyle={isLoading || status === "pending" ? "animate-spin" : ""}
      className="shadow-md hover:shadow-lg transition-shadow"
      disabled={isLoading || status === "pending"}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton;
