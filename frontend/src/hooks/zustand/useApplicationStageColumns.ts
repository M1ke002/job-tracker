import { create } from "zustand";
import ApplicationStage from "@/types/ApplicationStage";

interface ApplicationStageStore {
  applicationStageColumns: ApplicationStage[];
  setApplicationStageColumns: (applicationStages: ApplicationStage[]) => void;
}

export const useApplicationStageColumns = create<ApplicationStageStore>(
  (set) => ({
    applicationStageColumns: [],
    setApplicationStageColumns: (applicationStages) =>
      set({ applicationStageColumns: applicationStages }),
  })
);
