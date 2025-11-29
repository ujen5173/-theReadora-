"use client";

import { createId } from "@paralleldrive/cuid2";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useChapterStore } from "~/store/useChapter";
import { useUserStore } from "~/store/userStore";

const CHAPTER_ROUTE_REGEX = /^\/chapter\/[a-z0-9]{24,32}\/?$/;

const useReadCount = () => {
  const { chapter } = useChapterStore();
  const { user } = useUserStore();
  const pathname = usePathname();
  const startTimeRef = useRef<number | null>(null);
  const previousPath = useRef(pathname);

  // Generation of cuid for Anonymous users (not loggedin users)
  const getAnonymousId = (): string => {
    let cuid = localStorage.getItem("cuid");

    if (!cuid) {
      cuid = createId();
      localStorage.setItem("cuid", cuid);
    }

    return cuid;
  };

  const getReaderKey = (): {
    id: string;
    isAnonymous: boolean;
  } => ({
    id: user?.id ?? getAnonymousId(),
    isAnonymous: !!user?.id,
  });

  const sendBeaconReadEvent = (duration: number | null, chapterId: string) => {
    try {
      const readTimeSeconds =
        duration != null ? Math.round(duration / 1000) : null;

      const { id, isAnonymous } = getReaderKey();

      const payload = {
        chapterId,
        readTime: readTimeSeconds,
        ref: sessionStorage.getItem("ref"),
        searchQuery: sessionStorage.getItem("searchQuery") ?? undefined,
        readerKey: id,
        isAnonymous,
      } as const;

      const blob = new Blob([JSON.stringify(payload)], {
        type: "application/json",
      });

      if (navigator.sendBeacon) {
        return navigator.sendBeacon("/api/read-event", blob);
      }
    } catch {}

    return false;
  };

  const calculateReadTime = () => {
    const now = Date.now();
    return startTimeRef.current ? now - startTimeRef.current : 0;
  };

  const handleSendAPICall = () => {
    console.info("INCREASING READ COUNT...");

    const duration = calculateReadTime();
    const currentChapterId = chapter?.id;

    if (currentChapterId) {
      sendBeaconReadEvent(duration, currentChapterId);
    }
  };

  // Cleanup when leaving app (closing tab, reload)
  useEffect(() => {
    if (
      CHAPTER_ROUTE_REGEX.test(previousPath.current) &&
      previousPath.current !== pathname
    ) {
      handleSendAPICall();
    }
    previousPath.current = pathname;

    // Add multiple event listeners for better coverage
    window.addEventListener("pagehide", handleSendAPICall);
    window.addEventListener("beforeunload", handleSendAPICall);
    window.addEventListener("unload", handleSendAPICall);

    return () => {
      window.removeEventListener("pagehide", handleSendAPICall);
      window.removeEventListener("beforeunload", handleSendAPICall);
      window.removeEventListener("unload", handleSendAPICall);
    };
  }, [pathname, chapter?.id, user, pathname]);

  return null;
};

export default useReadCount;
