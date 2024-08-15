import React from "react";
import { Checkbox } from "../ui/checkbox";
import { FilteringStage } from "@/pages/SavedJobsPage";

interface JobFilterItemProps {
  stage: FilteringStage;
  handleFilterJobs: (stage: FilteringStage, active: boolean) => void;
}

const JobFilterItem = ({ stage, handleFilterJobs }: JobFilterItemProps) => {
  const handleCheckboxChange = () => {
    handleFilterJobs(stage, !stage.active);
  };

  return (
    <div className="flex items-center px-2 py-1 justify-between rounded-sm hover:bg-[#f8f8f8] transition-colors duration-400 cursor-pointer">
      <div className="flex items-center space-x-2">
        <Checkbox checked={stage.active} onClick={handleCheckboxChange} />
        <span>{stage.stageName}</span>
      </div>
      <div>
        <span>({stage.jobCount})</span>
      </div>
    </div>
  );
};

export default JobFilterItem;
