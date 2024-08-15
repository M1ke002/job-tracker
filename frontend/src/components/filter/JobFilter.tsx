import React, { useState } from "react";

import JobFilterItem from "./JobFilterItem";
import { FilteringStage } from "@/pages/SavedJobsPage";

interface JobFilterProps {
  filteringStages: FilteringStage[];
  handleFilterJobs: (stage: FilteringStage, active: boolean) => void;
}

const JobFilter = ({ filteringStages, handleFilterJobs }: JobFilterProps) => {
  return (
    <div className="p-4 rounded shadow-sm border-none">
      <p className="font-semibold mb-2">Stages</p>
      {filteringStages.map((stage) => (
        <JobFilterItem
          stage={stage}
          key={stage.stageName}
          handleFilterJobs={handleFilterJobs}
        />
      ))}
    </div>
  );
};

export default JobFilter;
