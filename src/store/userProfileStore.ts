import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TCard } from "~/app/_components/shared/novel-card";

export type ExtendedUser = {
  id: string;
  name: string;
  username: string;
  image: string | null;
  bio: string | null;
  createdAt: Date;
  followingCount: number;
  followersCount: number;
  stories: TCard[];
  premium: boolean;
};

type UserStore = {
  user: ExtendedUser | null;
  isLoading: boolean;
  setUser: (user: ExtendedUser | null) => void;
};

export const useUserProfileStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user, isLoading: false }),
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
