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

  // TODO: fix this production error
  // Type '{ id: string; storyId: string; chapterNumber: number | null; version: number; createdAt: Date; }' is missing the following properties from type 'Chapter': title, slug, updatedAt, metrics, mongoContentID
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
