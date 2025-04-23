import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useUserStore } from "~/store/userStore";

export function useAuthSync() {
  const { data: session, status } = useSession();
  const { setUser, clearUser } = useUserStore();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated" && session?.user) {
      setUser(session.user);
    } else {
      clearUser();
    }
  }, [session, status, setUser, clearUser]);

  return { isLoading: status === "loading" };
}
