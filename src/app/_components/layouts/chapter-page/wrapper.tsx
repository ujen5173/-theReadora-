"use client";

import React, { useEffect } from "react";
import type { getChapterDetailsBySlugOrIdResponse } from "~/server/api/routers/chapter";
import { useChapterStore } from "~/store/useChapter";

const ChapterWrapper = ({
  details,
  children,
}: {
  details: getChapterDetailsBySlugOrIdResponse;
  children: React.ReactNode;
}) => {
  const { setStory, setChapter, setInitialChunk } = useChapterStore();

  useEffect(() => {
    if (details) {
      setStory(details.story);
      setChapter(details.chapter);
      setInitialChunk(details.initialChunk);
    }
  }, []);

  return <>{children}</>;
};

export default ChapterWrapper;
