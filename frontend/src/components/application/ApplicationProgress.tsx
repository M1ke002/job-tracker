import { useMemo } from "react";

import ApplicationProgressItem from "./ApplicationProgressItem";
import ApplicationProgressItemSkeleton from "../skeleton/ApplicationProgressItemSkeleton";
import { ApplicationStageNames } from "@/constant/applicationStage";

import ApplicationStage from "@/types/ApplicationStage";
import SavedJob from "@/types/SavedJob";

import { useParams } from "react-router-dom";
import { useJobDetailsQuery } from "@/hooks/queries/useJobDetailsQuery";

const sortApplicationStages = (applicationStages: ApplicationStage[]) => {
  //output: [Applied, O.A., Interview, Offer, Rejected]
  const orderedStages: ApplicationStage[] = [];

  const stageApplied = applicationStages.find(
    (stage) => stage.stage_name === ApplicationStageNames.APPLIED
  );
  const stageOA = applicationStages.find(
    (stage) => stage.stage_name === ApplicationStageNames.OA
  );
  const stageInterview = applicationStages.find(
    (stage) => stage.stage_name === ApplicationStageNames.INTERVIEW
  );
  const stageOffer = applicationStages.find(
    (stage) => stage.stage_name === ApplicationStageNames.OFFER
  );
  const stageRejected = applicationStages.find(
    (stage) => stage.stage_name === ApplicationStageNames.REJECTED
  );

  if (stageApplied) orderedStages.push(stageApplied);
  if (stageOA) orderedStages.push(stageOA);
  if (stageInterview) orderedStages.push(stageInterview);
  if (stageOffer) orderedStages.push(stageOffer);
  if (stageRejected) orderedStages.push(stageRejected);

  return orderedStages;
};

//returns an array of ApplicationProgressItems
const getApplicationProgressItems = (
  applicationStages: ApplicationStage[],
  currentSavedJob: SavedJob | null
) => {
  if (!currentSavedJob) return [];

  const orderedStages = sortApplicationStages(applicationStages);

  const currentStage = orderedStages.find(
    (stage) => stage.id === currentSavedJob.stage_id
  );
  let currentStageIndex = orderedStages.findIndex(
    (stage) => stage.id === currentStage?.id
  );

  //if current job stage is rejected, then set currentStageIndex to the rejected_at_stage_id
  if (currentStage?.stage_name === ApplicationStageNames.REJECTED) {
    currentStageIndex = orderedStages.findIndex(
      (stage) => stage.id === currentSavedJob.rejected_at_stage_id
    );
  }

  let applicationProgressItems = [];
  for (let i = 0; i < orderedStages.length; i++) {
    const stage = orderedStages[i];
    if (stage.stage_name === ApplicationStageNames.REJECTED) continue;
    const isPassed = i < currentStageIndex;
    const isCurrentStage = i === currentStageIndex;
    const isRejected =
      currentStage?.stage_name === ApplicationStageNames.REJECTED;
    applicationProgressItems.push({
      stageId: stage.id,
      stageName: stage.stage_name,
      isPassed,
      isCurrentStage,
      isRejected,
    });
  }
  console.log(applicationProgressItems);
  return applicationProgressItems;
};

interface ApplicationProgressProps {
  isLoading: boolean;
  applicationStages: ApplicationStage[];
}

const ApplicationProgress = ({
  isLoading,
  applicationStages,
}: ApplicationProgressProps) => {
  const { id: currentSavedJobId } = useParams<{ id: string }>();
  const { data: currentSavedJob } = useJobDetailsQuery(currentSavedJobId);

  //useMemo to memoize the result of getApplicationProgressItems
  const applicationProgressItems = useMemo(() => {
    if (!currentSavedJob) return [];
    return getApplicationProgressItems(applicationStages, currentSavedJob);
  }, [applicationStages, currentSavedJob]);

  return (
    <div className="p-6 bg-white border border-[#dbe9ff] w-full shadow-sm overflow-auto">
      <div className="flex items-center min-w-[600px]">
        {isLoading ? (
          <>
            <ApplicationProgressItemSkeleton position="first" />
            <ApplicationProgressItemSkeleton position="middle" />
            <ApplicationProgressItemSkeleton position="middle" />
            <ApplicationProgressItemSkeleton position="last" />
          </>
        ) : (
          applicationProgressItems.map((item, index) => (
            <ApplicationProgressItem
              key={index}
              stageId={item.stageId.toString()}
              stageName={item.stageName}
              isPassed={item.isPassed}
              isCurrentStage={item.isCurrentStage}
              isRejected={item.isRejected}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ApplicationProgress;
