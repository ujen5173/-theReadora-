"use client";

import debounce from "lodash.debounce";
import { useCallback, useEffect, useRef, useState } from "react";
import { useChapterStore } from "~/store/useChapter";
import { useUserStore } from "~/store/userStore";
import { api } from "~/trpc/react";

const IncreaseReadCount = () => {
  const [hasFired, setFired] = useState(false);
  const timerRef = useRef<number>(0);
  const { mutateAsync } = api.chapter.increaseReadCount.useMutation();
  const { chapter } = useChapterStore();
  const { user } = useUserStore();
  const { data: chunkData } = api.chapter.getChunkLength.useQuery(
    {
      chapter_id: chapter?.id ?? "",
    },
    {
      enabled: !!chapter?.id,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const totalChunksInChapter = chunkData?.chunk?.index ?? 0;

  const fireReadCount = useCallback(async () => {
    if (!chapter?.id) return;

    try {
      if (!user) {
        let cuid = localStorage.getItem("cuid");
        if (!cuid) {
          cuid = crypto.randomUUID();
          localStorage.setItem("cuid", cuid);
        }
        await mutateAsync({
          chapterId: chapter.id,
        });
      } else {
        await mutateAsync({
          chapterId: chapter.id,
        });
      }
      setFired(true);
    } catch (error) {
      console.error("Failed to record read count:", error);
    }
  }, [chapter?.id, user, mutateAsync]);

  const attemptFire = useCallback(
    debounce(() => {
      if (hasFired || !totalChunksInChapter) return;

      // Get all preview-content elements that contain chapter content
      const contentElements = document.querySelectorAll(".preview-content");
      if (contentElements.length === 0) return;

      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.scrollY;

      // Calculate scroll progress as percentage
      const scrollProgress = (scrollPosition + viewportHeight) / documentHeight;

      // Fire if user has scrolled through 85% of the content or if all chunks are loaded
      if (
        scrollProgress >= 0.85 ||
        contentElements.length >= totalChunksInChapter
      ) {
        void fireReadCount();
      }
    }, 250),
    [hasFired, totalChunksInChapter, fireReadCount]
  );

  useEffect(() => {
    // Start with a 60-second timer for careful readers
    timerRef.current = window.setTimeout(() => void fireReadCount(), 60_000);
    window.addEventListener("scroll", attemptFire);

    return () => {
      clearTimeout(timerRef.current);
      window.removeEventListener("scroll", attemptFire);
      attemptFire.cancel(); // Cancel any pending debounced calls
    };
  }, [attemptFire, fireReadCount]);

  return null;
};

export default IncreaseReadCount;
