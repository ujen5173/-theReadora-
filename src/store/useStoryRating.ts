import { create } from "zustand";

interface RatingState {
  ratingCount: number;
  averageRating: number;
  setRatingCount: (count: number) => void;
  setAverageRating: (avgRating: number) => void;
}

const initialState = {
  ratingCount: 0,
  averageRating: 0.0,
};

export const useStoryRating = create<RatingState>()((set) => ({
  ...initialState,
  setRatingCount: (count) => set({ ratingCount: count }),
  setAverageRating: (avgRating) => set({ averageRating: avgRating }),
}));
