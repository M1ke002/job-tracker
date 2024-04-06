import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, SlidersHorizontal } from "lucide-react";

import axios from "@/lib/axiosConfig";
import JobItem from "@/components/jobs/JobItem";

import { useQuery } from "@tanstack/react-query";

import { useSavedJobs } from "@/stores/useSavedJobs";
import { useModal } from "@/stores/useModal";
import JobItemSkeleton from "@/components/skeleton/JobItemSkeleton";
import { useSavedJobsQuery } from "@/hooks/queries/useSavedJobsQuery";

const SavedJobsPage = () => {
  const { savedJobs, setSavedJobs, isFetched } = useSavedJobs();
  const { onOpen } = useModal();

  const { data: savedJobsData, status: savedJobsStatus } = useSavedJobsQuery();

  useEffect(() => {
    if (savedJobsData) {
      setSavedJobs(savedJobsData);
    }
  }, [savedJobsData]);

  return (
    <div className="relative mx-auto px-4 flex flex-col max-w-[1450px] min-h-[calc(100vh-60px)]">
      <div className="w-full flex items-center justify-between mt-4">
        {savedJobsStatus === "pending" ? (
          <Skeleton className="w-28 h-6 bg-zinc-200" />
        ) : (
          <p className="text-sm font-medium">{savedJobs.length} jobs</p>
        )}
        <div className="flex items-center space-x-2">
          <Button
            variant="primary"
            className="flex items-center"
            onClick={() => onOpen("createJob")}
          >
            <Plus size={20} className="mr-1" />
            Add job
          </Button>
          <Button
            className="text-sm font-medium text-[#3d3d3d] hover:text-[#3d3d3d] px-2 bg-white"
            variant="outlinePrimary"
          >
            <SlidersHorizontal size={20} />
          </Button>
        </div>
      </div>
      <Separator className="my-3" />
      <div className="grid md:grid-cols-2 gap-2 grid-cols-1 justify-items-center">
        {savedJobsStatus === "pending" ? (
          <>
            <JobItemSkeleton />
            <JobItemSkeleton />
            <JobItemSkeleton />
            <JobItemSkeleton />
          </>
        ) : (
          savedJobs.map((job) => (
            <JobItem
              type="savedJob"
              key={job.id}
              id={job.id}
              jobTitle={job.job_title}
              companyName={job.company_name}
              jobUrl={job.job_url}
              jobDescription={job.job_description}
              jobDate={job.job_date}
              location={job.location}
              salary={job.salary}
              additionalInfo={job.additional_info}
              stage={job.stage || undefined}
            />
          ))
        )}
      </div>
      {/* <Button className="mx-auto mt-4 mb-3 px-7" variant="primary">
        Load More
      </Button> */}

      {/* floating absolute add btn at bottom corner of screen */}
      {/* <div className="fixed bottom-0 right-0 mb-5 mr-5">
        <Button variant="primary" className="rounded-full flex items-center ">
          <Plus size={20} className="mr-1" />
          Add job
        </Button>
      </div> */}
    </div>
  );
};

export default SavedJobsPage;
