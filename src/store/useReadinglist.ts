import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TgetUserReadingList } from "~/server/api/routers/readinglist";

type List = {
  id: string;
  title: string;
  description: string;
  stories: { id: string; title: string }[];
};

type ReadinglistStore = {
  edited: List | null;
  isLoading: boolean;
  lists: TgetUserReadingList;
  deleteLoading: Record<string, boolean>;
  setDeleteLoading: (id: string, loading: boolean) => void;
  setLists: (lists: TgetUserReadingList) => void;
  setEdited: (list: List | null) => void;
  edit: boolean;
  setEdit: (e: boolean) => void;
  open: boolean;
  setOpen: (e: boolean) => void;
};

export const useReadinglistStore = create<ReadinglistStore>()(
  persist(
    (set) => ({
      edited: null,
      isLoading: true,
      lists: [],
      deleteLoading: {},
      setDeleteLoading: (id: string, loading: boolean) =>
        set((state) => ({
          deleteLoading: { ...state.deleteLoading, [id]: loading },
        })),
      setLists: (lists) => set({ lists, isLoading: false }),
      setEdited: (edited: List | null) => set({ edited, isLoading: false }),
      edit: false,
      setEdit: (e: boolean) => set({ edit: e }),
      open: false,
      setOpen: (e: boolean) => set({ open: e }),
    }),
    {
      name: "list-store",
      partialize: (state) => ({
        edit: state.edited,
      }),
    }
  )
);
