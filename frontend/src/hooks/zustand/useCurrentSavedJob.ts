import { create } from "zustand";
import SavedJob from "@/types/SavedJob";

interface CurrentSavedJobStore {
  currentSavedJob: SavedJob | null;
  setCurrentSavedJob: (savedJob: SavedJob) => void;
}

export const useCurrentSavedJob = create<CurrentSavedJobStore>((set) => ({
  currentSavedJob: null,
  setCurrentSavedJob: (savedJob) => set({ currentSavedJob: savedJob }),
}));
