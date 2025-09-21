import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useUserStore } from "~/store/userStore";

export function useAuthSync() {
  const { data: session, status } = useSession();
  const { setUser, clearUser } = useUserStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only run once when the component mounts or when session status changes from loading
    if (hasInitialized.current || status === "loading") return;

    hasInitialized.current = true;

    if (status === "authenticated" && session?.user) {
      setUser(session.user);
    } else {
      clearUser();
    }
  }, [session, status, setUser, clearUser]);

  return { isLoading: status === "loading" };
}
