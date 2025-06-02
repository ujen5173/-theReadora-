import { create } from "zustand";
import { getValidGenre } from "~/utils/helpers";

type FilterStore = {
  query: string;
  genre: string;
  sortBy: string;
  status: ("COMPLETED" | "MATURE")[];
  contentType: ("AI_GENREATED" | "ORIGINAL")[];
  minChapterCount: number;
  maxChapterCount: number;
  minViewsCount: number;
  maxViewsCount: number;
  publishedAt: "LAST_WEEK" | "LAST_MONTH" | "LAST_YEAR" | "ALL_TIME";
  tags: string[];
  setQuery: (query: string) => void;
  setGenre: (genre: string) => void;
  setSortBy: (sortBy: string) => void;
  setStatus: (status: ("COMPLETED" | "MATURE")[]) => void;
  setContentType: (contentType: ("AI_GENREATED" | "ORIGINAL")[]) => void;
  setChapterCount: (minChapterCount: number, maxChapterCount: number) => void;
  setViewsCount: (minViewsCount: number, maxViewsCount: number) => void;
  setPublishedAt: (
    publishedAt: "LAST_WEEK" | "LAST_MONTH" | "LAST_YEAR" | "ALL_TIME"
  ) => void;
  setTags: (tags: string[]) => void;
  resetAll: (preserveGenre?: string) => void;
  applyFilters: () => FilterParams;
};

type FilterParams = {
  query?: string;
  genre?: string;
  sortBy?: string;
  status?: ("COMPLETED" | "MATURE")[];
  contentType?: ("AI_GENREATED" | "ORIGINAL")[];
  minChapterCount?: number;
  maxChapterCount?: number;
  minViewsCount?: number;
  maxViewsCount?: number;
  publishedAt?: "LAST_WEEK" | "LAST_MONTH" | "LAST_YEAR" | "ALL_TIME";
  tags?: string[];
};

type FilterState = Omit<
  FilterStore,
  | "setQuery"
  | "setGenre"
  | "setSortBy"
  | "setStatus"
  | "setContentType"
  | "setChapterCount"
  | "setViewsCount"
  | "setPublishedAt"
  | "setTags"
  | "resetAll"
  | "applyFilters"
>;

const initialState: FilterState = {
  query: "",
  genre: "",
  sortBy: "",
  status: [],
  contentType: [],
  minChapterCount: 0,
  maxChapterCount: 0,
  minViewsCount: 0,
  maxViewsCount: 0,
  publishedAt: "ALL_TIME",
  tags: [],
};

export const useFilterStore = create<FilterStore>()((set, get) => ({
  ...initialState,
  setQuery: (query) => set({ query }),
  setGenre: (genre) => {
    const validGenre = getValidGenre(genre);
    set({ genre: validGenre || "" });
  },
  setSortBy: (sortBy) => set({ sortBy }),
  setStatus: (status) => set({ status }),
  setContentType: (contentType) => set({ contentType }),
  setChapterCount: (minChapterCount, maxChapterCount) =>
    set({ minChapterCount, maxChapterCount }),
  setViewsCount: (minViewsCount, maxViewsCount) =>
    set({ minViewsCount, maxViewsCount }),
  setPublishedAt: (publishedAt) => set({ publishedAt }),
  setTags: (tags) => set({ tags }),
  resetAll: (preserveGenre?: string) => {
    if (preserveGenre) {
      set({
        ...initialState,
        genre: preserveGenre,
      });
    } else {
      set(initialState);
    }
  },
  applyFilters: () => {
    const state = get();
    const filters: FilterParams = {};

    if (state.query?.trim()) filters.query = state.query.trim();
    if (state.genre?.trim()) filters.genre = state.genre.trim();
    if (state.sortBy?.trim()) filters.sortBy = state.sortBy.trim();
    if (state.status.length > 0) filters.status = state.status;
    if (state.contentType.length > 0) filters.contentType = state.contentType;
    if (state.minChapterCount > 0)
      filters.minChapterCount = state.minChapterCount;
    if (state.maxChapterCount > 0)
      filters.maxChapterCount = state.maxChapterCount;
    if (state.minViewsCount > 0) filters.minViewsCount = state.minViewsCount;
    if (state.maxViewsCount > 0) filters.maxViewsCount = state.maxViewsCount;
    if (state.publishedAt !== "ALL_TIME")
      filters.publishedAt = state.publishedAt;
    if (state.tags.length > 0) filters.tags = state.tags;

    return filters;
  },
}));
