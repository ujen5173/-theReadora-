import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProfileState {
  name: string;
  username: string;
  email: string;
  bio: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  premium: boolean;
  premiumUntil: Date | null;
  // Actions
  setProfile: (profile: Partial<ProfileState>) => void;
  updateProfileImage: (image: string) => void;
  resetProfile: () => void;
}

const initialState = {
  name: "",
  username: "",
  email: "",
  bio: null,
  image: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  premium: false,
  premiumUntil: null,
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      ...initialState,
      setProfile: (profile) => set((state) => ({ ...state, ...profile })),
      updateProfileImage: (image) => set({ image }),
      resetProfile: () => set(initialState),
    }),
    {
      name: "profile-storage",
    }
  )
);
