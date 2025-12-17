"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { api } from "~/trpc/react";

export function UserActivityTracker() {
  const { data: session } = useSession();
  const { mutate: updateLastActive } = api.user.updateLastActive.useMutation();

  useEffect(() => {
    if (session?.user) {
      // Update immediately on mount
      updateLastActive();

      // Set up interval to update every 5 minutes if user is still on the page
      const intervalId = setInterval(() => {
        if (session.user) {
          updateLastActive();
        }
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(intervalId);
    }
  }, [session, updateLastActive]);

  return null;
}
