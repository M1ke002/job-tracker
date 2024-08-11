import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, SlidersHorizontal, Search } from "lucide-react";

import axios from "@/lib/axiosConfig";
import JobItem from "@/components/jobs/JobItem";
import JobItemSkeleton from "@/components/skeleton/JobItemSkeleton";

import { useQuery } from "@tanstack/react-query";

import { useSavedJobs } from "@/stores/useSavedJobs";
import { useModal } from "@/stores/useModal";
import { useSavedJobsQuery } from "@/hooks/queries/useSavedJobsQuery";
import SearchBox from "@/components/search/SearchBox";

const SavedJobsPage = () => {
  const { savedJobs, setSavedJobs, isFetched } = useSavedJobs();
  const { onOpen } = useModal();

  const { data: savedJobsData, status: savedJobsStatus } = useSavedJobsQuery();

  //for searching jobs
  const [searchText, setSearchText] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    if (savedJobsData) {
      setSavedJobs(savedJobsData);
    }
  }, [savedJobsData]);

  const handleSearchJobs = (value: string) => {
    console.log(value);
  };

  return (
    <div className="h-full">
      <div className="border-[#dce6f8] border-b-[1px] bg-white h-[64px]">
        <div className="flex items-center justify-between max-w-[1450px] w-full px-4 mx-auto py-3">
          <div className="w-full flex items-center justify-between">
            <Button
              className="text-sm font-medium text-[#3d3d3d] hover:text-[#3d3d3d] px-2 bg-white"
              variant="outlinePrimary"
            >
              <SlidersHorizontal size={20} className="mr-1" />
              All Filters
            </Button>
            <div className="flex items-center space-x-2">
              <Button
                variant="primary"
                className="flex items-center"
                onClick={() => onOpen("createJob")}
              >
                <Plus size={20} className="mr-1" />
                Add job
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1450px] mx-auto py-3 px-4 min-h-[calc(100vh-60px-24px-64px)]">
        <div className="flex items-center w-full justify-between space-x-2">
          {savedJobsStatus === "pending" ? (
            <Skeleton className="w-28 h-6 bg-zinc-200" />
          ) : (
            <p className="text-sm font-medium">{savedJobs.length} saved jobs</p>
          )}
          <SearchBox
            searchText={searchText}
            setSearchText={setSearchText}
            isSearching={isSearching}
            onSearch={handleSearchJobs}
            placeholder="Search jobs"
          />
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
    </div>
  );
};

export default SavedJobsPage;
