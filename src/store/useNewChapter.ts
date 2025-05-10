import type { JSONContent } from "novel";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CHAPTER_PRICE_POOL } from "~/utils/constants";

type NewChapterStore = {
  storyId: string | null;
  title: string;
  wordCount: number;
  content: JSONContent;
  isAutoSaving: boolean;
  setTitle: (title: string) => void;
  setContent: (content: JSONContent) => void;
  htmlContent: string;
  focusMode: boolean;
  isLocked: boolean;
  price: keyof typeof CHAPTER_PRICE_POOL | null;
  setIsLocked: (isLocked: boolean) => void;
  setPrice: (price: keyof typeof CHAPTER_PRICE_POOL | null) => void;
  setHtmlContent: (htmlContent: string) => void;
  setWordCount: (wordCount: number) => void;
  setIsAutoSaving: (isAutoSaving: boolean) => void;
  setStoryId: (storyId: string | null) => void;
  setFocusMode: (focusMode: boolean) => void;
  hardSaved: boolean;
  setHardSaved: (hardSaved: boolean) => void;
  setResetForm: () => void;
};

export const useNewChapterStore = create<NewChapterStore>()(
  persist(
    (set) => ({
      storyId: null,
      title: "Untitled Chapter",
      wordCount: 0,
      content: {},
      htmlContent: "",
      isAutoSaving: false,
      focusMode: false,
      hardSaved: false,
      isLocked: false,
      price: null,
      setIsLocked: (isLocked) => set({ isLocked }),
      setPrice: (price) => set({ price }),
      setTitle: (title) => set({ title }),
      setContent: (content) => set({ content }),
      setHtmlContent: (htmlContent) => set({ htmlContent }),
      setWordCount: (wordCount) => set({ wordCount }),
      setIsAutoSaving: (isAutoSaving) => set({ isAutoSaving }),
      setStoryId: (storyId) => set({ storyId }),
      setFocusMode: (focusMode) => set({ focusMode }),
      setHardSaved: (hardSaved) => set({ hardSaved }),
      setResetForm: () =>
        set({
          title: "Untitled Chapter",
          wordCount: 0,
          content: {},
          htmlContent: "",
        }),
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        storyId: state.storyId,
        title: state.title,
        wordCount: state.wordCount,
        content: state.content,
        isAutoSaving: state.isAutoSaving,
        focusMode: state.focusMode,
        hardSaved: state.hardSaved,
      }),
    }
  )
);
