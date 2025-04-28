"use client";

import { useEffect, useRef, useState } from "react";
import { useChapterStore } from "~/store/useChapter";
import { api } from "~/trpc/react";

const IncreaseReadCount = () => {
  const [hasFired, setFired] = useState(false);
  const timerRef = useRef<number>(0);
  const { mutateAsync } = api.story.increaseReadCount.useMutation();
  const { story } = useChapterStore();

  useEffect(() => {
    function attemptFire() {
      if (hasFired) return;
      // e.g. check scroll position
      const halfway = window.scrollY > document.body.scrollHeight / 2;
      if (halfway) {
        setFired(true);
        mutateAsync({
          storyId: story?.id as string,
        });
      }
    }
    // time + scroll hybrid
    timerRef.current = window.setTimeout(attemptFire, 10_000); // 10 sec
    window.addEventListener("scroll", attemptFire);
    return () => {
      clearTimeout(timerRef.current);
      window.removeEventListener("scroll", attemptFire);
    };
  }, [hasFired, story?.id]);

  return null;
};

export default IncreaseReadCount;
