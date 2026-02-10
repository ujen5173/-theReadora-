import { create } from "zustand";

type FilterStore = {
  query: string;
  genre: string;
  sortBy: string;
  status: ("COMPLETED" | "MATURE")[];
  contentType: ("AI_GENERATED" | "ORIGINAL" | "GRAPHICS")[];
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
  setContentType: (
    contentType: ("AI_GENERATED" | "ORIGINAL" | "GRAPHICS")[],
  ) => void;
  setChapterCount: (minChapterCount: number, maxChapterCount: number) => void;
  setViewsCount: (minViewsCount: number, maxViewsCount: number) => void;
  setPublishedAt: (
    publishedAt: "LAST_WEEK" | "LAST_MONTH" | "LAST_YEAR" | "ALL_TIME",
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
  contentType?: ("AI_GENERATED" | "ORIGINAL" | "GRAPHICS")[];
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
  contentType: ["AI_GENERATED", "ORIGINAL"],
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
    const validGenre = genre;
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

/**
 * Parse URLSearchParams into a FilterParams object.
 * Arrays are comma-separated in params, e.g., status=COMPLETED,MATURE
 */
export function parseFilterParamsFromURL(
  urlParams: URLSearchParams,
): FilterParams {
  const getString = (key: string) => {
    const v = urlParams.get(key);
    return v && v.length > 0 ? v : undefined;
  };

  const getArray = (key: string): string[] | undefined => {
    const v = urlParams.get(key);
    if (!v) return undefined;
    return v
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  };

  const fp: FilterParams = {};

  fp.query = getString("query");
  fp.genre = getString("genre");
  fp.sortBy = getString("sortBy");
  fp.status = getArray("status") as ("COMPLETED" | "MATURE")[] | undefined;
  fp.contentType = getArray("contentType") as
    | ("AI_GENERATED" | "ORIGINAL" | "GRAPHICS")[]
    | undefined;
  if (getString("minChapterCount"))
    fp.minChapterCount = Number(urlParams.get("minChapterCount"));
  if (getString("maxChapterCount"))
    fp.maxChapterCount = Number(urlParams.get("maxChapterCount"));
  if (getString("minViewsCount"))
    fp.minViewsCount = Number(urlParams.get("minViewsCount"));
  if (getString("maxViewsCount"))
    fp.maxViewsCount = Number(urlParams.get("maxViewsCount"));
  fp.publishedAt = getString("publishedAt") as FilterParams["publishedAt"];
  fp.tags = getArray("tags");

  return fp;
}

/**
 * Convert a FilterParams object to URLSearchParams. Arrays -> comma-separated.
 */
export function stringifyFilterParamsToURL(
  params: FilterParams,
): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (params.query) searchParams.set("query", params.query);
  if (params.genre) searchParams.set("genre", params.genre);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.status && params.status.length > 0)
    searchParams.set("status", params.status.join(","));
  if (params.contentType && params.contentType.length > 0)
    searchParams.set("contentType", params.contentType.join(","));
  if (params.minChapterCount !== undefined)
    searchParams.set("minChapterCount", String(params.minChapterCount));
  if (params.maxChapterCount !== undefined)
    searchParams.set("maxChapterCount", String(params.maxChapterCount));
  if (params.minViewsCount !== undefined)
    searchParams.set("minViewsCount", String(params.minViewsCount));
  if (params.maxViewsCount !== undefined)
    searchParams.set("maxViewsCount", String(params.maxViewsCount));
  if (params.publishedAt) searchParams.set("publishedAt", params.publishedAt);
  if (params.tags && params.tags.length > 0)
    searchParams.set("tags", params.tags.join(","));

  return searchParams;
}
