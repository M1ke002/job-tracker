import React from "react";

import { Skeleton } from "../ui/skeleton";

const JobCardSkeleton = () => {
  return (
    <div className="flex flex-col relative group bg-white border-[1px] border-[#dce6f8] rounded-md p-3 mb-2 drop-shadow-sm">
      <div className="font-semibold mb-2">
        {/* {job.job_title} */}
        <Skeleton className="w-3/4 h-6 bg-zinc-200" />
      </div>
      <div className="text-sm">
        {/* {job.company_name} */}
        <Skeleton className="w-20 h-4" />
      </div>
    </div>
  );
};

export default JobCardSkeleton;
