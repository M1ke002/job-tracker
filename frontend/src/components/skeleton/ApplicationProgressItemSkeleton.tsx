import React from "react";

import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

interface ApplicationProgressItemSkeletonProps {
  position: "first" | "middle" | "last";
}

const ApplicationProgressItemSkeleton = ({
  position,
}: ApplicationProgressItemSkeletonProps) => {
  return (
    <div
      className={cn(
        "h-[44px] relative flex items-center justify-center flex-1 border-[1px] text-sm py-3 leading-[1]",
        position !== "last" &&
          'after:content-[""] after:absolute after:bottom-[0] after:-top-px after:w-[0] after:h-[0] after:-right-[16px] after:border-l-[16px] after:border-l-[#fff] after:border-t-[22px] after:border-t-transparent after:border-b-[22px] after:border-b-[transparent] after:[filter:drop-shadow(1px_0px_0px_#ccc)] after:z-[2]',
        position === "first" && "rounded-l-sm",
        position === "last" && "rounded-r-sm"
      )}
    >
      – –
    </div>
  );
};

export default ApplicationProgressItemSkeleton;
