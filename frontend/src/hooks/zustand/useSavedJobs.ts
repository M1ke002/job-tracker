import { create } from "zustand";
import SavedJob from "@/types/SavedJob";

interface SavedJobsStore {
  savedJobs: SavedJob[];
  setSavedJobs: (savedJobs: SavedJob[]) => void;
}

export const useSavedJobs = create<SavedJobsStore>((set) => ({
  savedJobs: [],
  setSavedJobs: (savedJobs) => set({ savedJobs }),
}));
