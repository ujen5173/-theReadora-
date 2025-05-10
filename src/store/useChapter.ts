import type { JsonValue } from "@prisma/client/runtime/library";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CHAPTER_PRICE_POOL } from "~/utils/constants";

export type useChapterChapter = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  price: keyof typeof CHAPTER_PRICE_POOL | null;
  title: string;
  slug: string;
  storyId: string;
  isLocked: boolean;
  chapterNumber: number;
  metrics: JsonValue;
  readershipAnalytics: JsonValue;
  mongoContentID: string[];
};

export type useChapterUser = {
  name: string;
  id: string;
  username: string;
  image: string | null;
};

export type useChapterStory = {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  chapterCount: number;
  author: useChapterUser;
  chapters: {
    id: string;
    title: string;
    slug: string;
    chapterNumber: number;
    isLocked: boolean;
    price: keyof typeof CHAPTER_PRICE_POOL | null;
  }[];
};

export type Chunk = {
  id: string;
  content: string;
  index: number;
};

type ChapterStore = {
  story: useChapterStory | null;
  chapter: useChapterChapter | null;
  isLoading: boolean;
  initialChunk: Chunk | null;
  setChapter: (chapter: useChapterChapter) => void;
  setStory: (story: useChapterStory) => void;
  setInitialChunk: (initialChunk: Chunk) => void;
};

export const useChapterStore = create<ChapterStore>()(
  persist(
    (set) => ({
      story: null,
      chapter: null,
      isLoading: true,
      initialChunk: null,
      setChapter: (chapter) => set({ chapter, isLoading: false }),
      setStory: (story) => set({ story, isLoading: false }),
      setInitialChunk: (initialChunk) => set({ initialChunk }),
    }),
    {
      name: "chapter-store",
      partialize: (state) => ({
        story: state.story,
        chapter: state.chapter,
        initialChunk: state.initialChunk,
      }),
    }
  )
);
