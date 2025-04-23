import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
};

type UserStore = {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user, isLoading: false }),
      clearUser: () => set({ user: null, isLoading: false }),
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        user: state.user
          ? {
              name: state.user.name,
              image: state.user.image,
            }
          : null,
      }),
    }
  )
);
