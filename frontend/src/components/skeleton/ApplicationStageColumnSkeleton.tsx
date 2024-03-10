import React from "react";

import { Skeleton } from "../ui/skeleton";
import { MoreHorizontal } from "lucide-react";
import JobCardSkeleton from "./JobCardSkeleton";

interface ApplicationStageColumnSkeletonProps {
  jobNumber: number;
}

const ApplicationStageColumnSkeleton = ({
  jobNumber = 3,
}: ApplicationStageColumnSkeletonProps) => {
  return (
    <div className="px-2 h-full">
      {/* #ebf4ff instead of #fff???? */}
      <div className="flex flex-col p-3 w-[340px] rounded-lg bg-[#fff] shadow-md border-[1px] border-[#c3dafe]">
        <div className="flex items-center justify-between touch-none">
          <span className="flex items-center space-x-1 font-medium">
            {/* {stage_name} */}
            <Skeleton className="w-20 h-5 bg-zinc-300" />
            <div className="rounded-full text-center px-2 py-1 text-xs font-semibold ml-2 inline-block">
              {/* {jobs.length} */}
              <Skeleton className="w-6 h-6 rounded-full bg-zinc-200" />
            </div>
          </span>
          <button className="p-2 rounded-md border-none focus:outline-none hover:text-zinc-600">
            <MoreHorizontal size={20} />
          </button>
        </div>

        <hr className="my-2 border-[#d6eaff]" />

        <div className="max-h-[360px] overflow-y-auto">
          {jobNumber === 0 && (
            <div className="flex items-center justify-center h-[100px] mb-2 font-semibold rounded-md border border-dashed border-[#c3dafe]">
              <p className=" text-gray-500">Drag job here</p>
            </div>
          )}
          {[...Array(jobNumber)].map((_, index) => (
            <JobCardSkeleton key={index} />
          ))}
        </div>

        <hr className="my-2 border-[#d6eaff]" />
        <Skeleton className="w-20 h-6 mr-2" />
      </div>
    </div>
  );
};

export default ApplicationStageColumnSkeleton;
