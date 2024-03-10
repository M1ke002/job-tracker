import React from "react";

import { Skeleton } from "../ui/skeleton";

const JobDescriptionSkeleton = () => {
  return (
    <div className="text-gray-700 space-y-3">
      <Skeleton className="w-20 h-6 bg-zinc-200" />
      <Skeleton className="w-[90%] h-8" />
      <Skeleton className="w-[70%] h-6" />
      <Skeleton className="w-full h-28" />
    </div>
  );
};

export default JobDescriptionSkeleton;
