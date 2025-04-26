"use client";

import React, { useLayoutEffect } from "react";
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

  useLayoutEffect(() => {
    if (details) {
      setStory(details.story);
      setChapter(details.chapter);
      setInitialChunk(details.initialChunk);
    }
  }, [details, setStory, setChapter, setInitialChunk]);

  return <>{children}</>;
};

export default ChapterWrapper;
