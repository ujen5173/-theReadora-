"use client";
import React, { useEffect } from "react";
import {
  useChapterStore,
  type Chunk,
  type useChapterChapter,
  type useChapterStory,
} from "~/store/useChapter";

const ChapterWrapper = ({
  details,
  children,
}: {
  details: {
    story: useChapterStory;
    chapter: useChapterChapter;
    initialChunk: Chunk;
  };
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
