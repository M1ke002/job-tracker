import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

const JobItemSkeleton = () => {
  return (
    <Card className="relative max-w-[680px] my-2 border-[#c3dafe] w-full">
      <CardHeader>
        <CardTitle className="mb-1 leading-7">
          {/* {jobTitle.length > 75 ? jobTitle.substring(0, 75) + "..." : jobTitle} */}
          <Skeleton className="w-3/4 h-6 bg-zinc-200" />
        </CardTitle>
        <div className="pt-1 flex items-center flex-wrap">
          <span className="text-sm font-semibold py-1 px-2 rounded-md">
            {/* {companyName} */}
            <Skeleton className="w-20 h-4" />
          </span>
          <span className="ml-3 text-xs uppercase p-1 px-2 rounded-md font-bold">
            {/* {jobDate} */}
            <Skeleton className="w-20 h-4" />
          </span>
        </div>
      </CardHeader>
      <CardContent className="mb-[77px] pb-3">
        <div className="mb-2">
          <div className="text-sm font-semibold">
            {/* {location} {additionalInfo && `· ${additionalInfo}`} */}
            <Skeleton className="w-20 h-5 mb-2 bg-zinc-200" />
          </div>
          <div className="text-sm">
            {/* {salary} */}
            <Skeleton className="w-40 h-4" />
          </div>
        </div>
        <div className="mb-2 text-sm text-zinc-500 max-h-[120px] overflow-y-auto">
          {/* {jobDescription} */}
          <Skeleton className="w-full h-20" />
        </div>
        {/* <hr className="border-[#d6eaff]" /> */}
      </CardContent>
      <CardFooter className="flex flex-col absolute bottom-0 right-0 left-0">
        <hr className="border-[#d6eaff] mb-3 w-full" />

        <div className="flex items-center space-x-2 mr-auto w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <Skeleton className="w-20 h-8 mr-2" />
              <Skeleton className="w-20 h-8" />
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default JobItemSkeleton;
