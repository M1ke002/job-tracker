import { create } from "zustand";
import SavedJob from "@/types/SavedJob";

interface CurrentSavedJobStore {
  currentSavedJob: SavedJob | null;
  setCurrentSavedJob: (savedJob: SavedJob | null) => void;
}

export const useCurrentSavedJob = create<CurrentSavedJobStore>((set) => ({
  currentSavedJob: null,
  setCurrentSavedJob: (savedJob: SavedJob | null) =>
    set(() => ({ currentSavedJob: savedJob })),
}));
