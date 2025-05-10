import type { JsonValue } from "@prisma/client/runtime/library";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CHAPTER_PRICE_POOL } from "~/utils/constants";

type Chapter = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  slug: string;
  storyId: string;
  chapterNumber: number;
  metrics: JsonValue;
  readershipAnalytics: JsonValue;
  mongoContentID: string[];
  isLocked: boolean;
  price: keyof typeof CHAPTER_PRICE_POOL | null;
};

type User = {
  name: string;
  id: string;
  username: string;
  image: string | null;
};

type Story = {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  chapterCount: number;
  author: User;
  chapters: {
    id: string;
    title: string;
    slug: string;
    chapterNumber: number;
  }[];
};

export type Chunk = {
  id: string;
  content: string;
  index: number;
};

type ChapterStore = {
  story: Story | null;
  chapter: Chapter | null;
  isLoading: boolean;
  initialChunk: Chunk | null;
  setChapter: (chapter: Chapter) => void;
  setStory: (story: Story) => void;
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
