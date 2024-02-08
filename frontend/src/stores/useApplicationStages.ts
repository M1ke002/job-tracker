import { create } from "zustand";
import ApplicationStage from "@/types/ApplicationStage";

interface ApplicationStagesStore {
  applicationStages: ApplicationStage[];
  setApplicationStages: (applicationStages: ApplicationStage[]) => void;
}

export const useApplicationStages = create<ApplicationStagesStore>((set) => ({
  applicationStages: [],
  setApplicationStages: (applicationStages) =>
    set({ applicationStages: applicationStages }),
}));
