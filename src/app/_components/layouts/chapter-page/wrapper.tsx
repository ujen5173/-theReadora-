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
  /*
    Type error: Argument of type '{ id: string; storyId: string; chapterNumber: number | null; version: number; createdAt: Date; }' is not assignable to parameter of type 'Chapter'.
    Type '{ id: string; storyId: string; chapterNumber: number | null; version: number; createdAt: Date; }' is missing the following properties from type 'Chapter': updatedAt, title, slug, metrics, and 4 more.
  */

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
