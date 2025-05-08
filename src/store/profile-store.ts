import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProfileState {
  name: string;
  username: string;
  email: string;
  bio: string | null;
  image: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
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
  emailVerified: null,
  createdAt: new Date(),
  updatedAt: new Date(),
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
