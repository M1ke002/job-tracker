import { create } from "zustand";
import SavedJob from "@/types/SavedJob";

interface SavedJobsStore {
  savedJobs: SavedJob[];
  isFetched: boolean;
  setSavedJobs: (savedJobs: SavedJob[]) => void;
}

//removed
export const useSavedJobs = create<SavedJobsStore>((set) => ({
  savedJobs: [],
  isFetched: false,
  setSavedJobs: (savedJobs) => set({ savedJobs, isFetched: true }),
}));
