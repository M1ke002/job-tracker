import React, { useState } from "react";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

import axios from "@/lib/axiosConfig";

import { useCurrentSavedJob } from "@/stores/useCurrentSavedJob";

interface ApplicationProgressItemProps {
  stageId: string;
  stageName: string;
  isPassed: boolean;
  isCurrentStage: boolean;
  isRejected: boolean;
}

const ApplicationProgressItem = ({
  stageId,
  stageName,
  isPassed,
  isCurrentStage,
  isRejected = false,
}: ApplicationProgressItemProps) => {
  const [loading, setLoading] = useState(false);
  const { currentSavedJob, setCurrentSavedJob } = useCurrentSavedJob();

  const changeJobStage = async (stageId: string) => {
    try {
      console.log(stageId);
      setLoading(true);
      const res = await axios.put(`/saved-jobs/${currentSavedJob?.id}/stage`, {
        stageId: stageId,
      });
      setLoading(false);
      setCurrentSavedJob(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={cn(
        "h-[44px] relative flex items-center justify-center flex-1 border-[1px] text-sm py-3 leading-[1] cursor-pointer hover:bg-[#f3f7f8] hover:after:border-l-[#f3f7f8]",
        stageName !== "Offer" &&
          'after:content-[""] after:absolute after:bottom-[0] after:-top-px after:w-[0] after:h-[0] after:-right-[16px] after:border-l-[16px] after:border-l-[#fff] after:border-t-[22px] after:border-t-transparent after:border-b-[22px] after:border-b-[transparent] after:[filter:drop-shadow(1px_0px_0px_#ccc)] after:z-[2]',
        isRejected &&
          "cursor-not-allowed border-[#dcdcdc] bg-[#f7f7f7] after:border-l-[#f7f7f7] hover:bg-[#f7f7f7] hover:after:border-l-[#f7f7f7] text-gray-400",
        stageName === "Applied" && "rounded-l-sm",
        stageName === "Offer" && "rounded-r-sm",
        isPassed &&
          "border-[#3975d4] text-white bg-[#3975d4] after:border-l-[#3975d4] hover:bg-[#4e80cf] hover:after:border-l-[#4e80cf]",
        isCurrentStage &&
          "border-[#77a4eb] text-white bg-[#77a4eb] after:border-l-[#77a4eb] hover:bg-[#4e80cf] hover:after:border-l-[#4e80cf] after:[filter:drop-shadow(1px_0px_0px_#77a4eb)]",
        isPassed &&
          isRejected &&
          "border-[#92b2e6] text-white bg-[#92b2e6] after:border-l-[#92b2e6] hover:bg-[#92b2e6] hover:after:border-l-[#92b2e6]",
        isCurrentStage &&
          isRejected &&
          "border-[#a8c4f1] text-white bg-[#a8c4f1] after:border-l-[#a8c4f1] hover:bg-[#a8c4f1] hover:after:border-l-[#a8c4f1] after:[filter:drop-shadow(1px_0px_0px_#a8c4f1)]"
      )}
      onClick={() => {
        if (isRejected) return;
        changeJobStage(stageId);
      }}
    >
      {stageName}
      {isPassed && <Check size={16} className="ml-2" />}
    </div>
  );
};

export default ApplicationProgressItem;
