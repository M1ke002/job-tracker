import React, { useMemo } from "react";
import ApplicationProgressItem from "./ApplicationProgressItem";

import ApplicationStage from "@/types/ApplicationStage";
import SavedJob from "@/types/SavedJob";

import { useCurrentSavedJob } from "@/stores/useCurrentSavedJob";
import { useApplicationStages } from "@/stores/useApplicationStages";

//returns an array of ApplicationProgressItems
//order of stages: applied -> O.A. -> Interviewing -> Offer.
const getApplicationProgressItems = (
  applicationStages: ApplicationStage[],
  currentSavedJob: SavedJob | null
) => {
  if (!currentSavedJob) return [];
  const currentStage = applicationStages.find(
    (stage) => stage.id === currentSavedJob.stage_id
  );
  let currentStageIndex = applicationStages.findIndex(
    (stage) => stage.id === currentStage?.id
  );

  //if current job stage is rejected, then set currentStageIndex to the rejected_at_stage_id
  if (currentStage?.stage_name === "Rejected") {
    currentStageIndex = applicationStages.findIndex(
      (stage) => stage.id === currentSavedJob.rejected_at_stage_id
    );
  }

  let applicationProgressItems = [];
  for (let i = 0; i < applicationStages.length; i++) {
    const stage = applicationStages[i];
    if (stage.stage_name === "Rejected") continue;
    const isPassed = i < currentStageIndex;
    const isCurrentStage = i === currentStageIndex;
    const isRejected = currentStage?.stage_name === "Rejected";
    applicationProgressItems.push({
      stageId: stage.id,
      stageName: stage.stage_name,
      isPassed,
      isCurrentStage,
      isRejected,
    });
  }
  return applicationProgressItems;
};

const ApplicationProgress = () => {
  const { currentSavedJob, setCurrentSavedJob } = useCurrentSavedJob();
  const { applicationStages, setApplicationStages } = useApplicationStages();

  //useMemo to memoize the result of getApplicationProgressItems
  const applicationProgressItems = useMemo(
    () => getApplicationProgressItems(applicationStages, currentSavedJob),
    [applicationStages, currentSavedJob]
  );

  return (
    <div className="p-6 bg-white border border-[#dbe9ff] w-full shadow-sm overflow-auto">
      <div className="flex items-center min-w-[600px]">
        {applicationProgressItems.map((item, index) => (
          <ApplicationProgressItem
            key={index}
            stageId={item.stageId.toString()}
            stageName={item.stageName}
            isPassed={item.isPassed}
            isCurrentStage={item.isCurrentStage}
            isRejected={item.isRejected}
          />
        ))}
      </div>
    </div>
  );
};

export default ApplicationProgress;
