import React, { useState, useEffect } from "react";

import { Plus, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { filterJobs, paginateJobs, searchJobs } from "@/utils/utils";
import { ApplicationStageNames } from "@/constant/applicationStage";
import axios from "@/lib/axiosConfig";

import JobItem from "@/components/jobs/JobItem";
import JobItemSkeleton from "@/components/skeleton/JobItemSkeleton";
import SearchBox from "@/components/search/SearchBox";
import PaginationBox from "@/components/pagination/PaginationBox";
import JobFilter from "@/components/filter/JobFilter";
import SavedJob from "@/types/SavedJob";

import { useQuery } from "@tanstack/react-query";
import { useSavedJobs } from "@/stores/useSavedJobs";
import { useModal } from "@/stores/useModal";
import { useSavedJobsQuery } from "@/hooks/queries/useSavedJobsQuery";

const PER_PAGE = 20;
export const SAVED_STAGE = "Saved";

export interface FilteringStage {
  stageName: string;
  active: boolean;
  jobCount: number;
}

const SavedJobsPage = () => {
  const { savedJobs, setSavedJobs } = useSavedJobs();
  const { onOpen } = useModal();
  //for searching jobs
  const [searchText, setSearchText] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  // Local state to display the filtered/paginated jobs
  const [displayedJobs, setDisplayedJobs] = useState(savedJobs);
  //filtering stages
  const [filteringStages, setFilteringStages] = useState<FilteringStage[]>([
    { stageName: SAVED_STAGE, active: false, jobCount: 0 },
    { stageName: ApplicationStageNames.APPLIED, active: false, jobCount: 0 },
    { stageName: ApplicationStageNames.OA, active: false, jobCount: 0 },
    { stageName: ApplicationStageNames.INTERVIEW, active: false, jobCount: 0 },
    { stageName: ApplicationStageNames.OFFER, active: false, jobCount: 0 },
    { stageName: ApplicationStageNames.REJECTED, active: false, jobCount: 0 },
  ]);
  //pagination data
  const [pages, setPages] = useState({
    totalPages: 1,
    totalJobCount: savedJobs.length,
    currentPage: 1,
  });

  const { data: savedJobsData, status: savedJobsStatus } = useSavedJobsQuery();

  // Helper function to handle search, filtering, pagination
  const getDisplayedJobs = (
    jobs: SavedJob[],
    page: number,
    query: string,
    filteredStages: string[],
    hasSearch: boolean = true,
    hasFilter: boolean = true,
    hasPagination: boolean = true
  ) => {
    let displayedJobs = jobs;

    //if searching is applied
    if (hasSearch) {
      displayedJobs = searchJobs(jobs, query);
    }

    //if filtering is applied
    if (hasFilter) {
      displayedJobs = filterJobs(displayedJobs, filteredStages);
    }

    //if pagination is applied
    if (hasPagination) {
      const paginationResult = paginateJobs(displayedJobs, page, PER_PAGE);
      setPages({
        totalPages: paginationResult.totalPages,
        totalJobCount: paginationResult.totalJobCount,
        currentPage: page,
      });
      displayedJobs = paginationResult.paginatedJobs;
    }

    return displayedJobs;
  };

  //set savedJobsData and displayedJobs after fetching from api
  useEffect(() => {
    if (savedJobsData) {
      setSavedJobs(savedJobsData);

      //TODO: check if calling getDisplayedJobs() here is necessary, since it is also called in savedJobs useeffect below
      // const displayedJobs = getDisplayedJobs(
      //   savedJobsData,
      //   pages.currentPage,
      //   searchText,
      //   [],
      //   false,
      //   false,
      //   true
      // );
      // setDisplayedJobs(displayedJobs);
    }
  }, [savedJobsData]);

  //update displayedJobs when savedJobs state changes(eg new job added/job deleted)
  //update filteringStages stages
  useEffect(() => {
    const filteredStages = filteringStages
      .filter((stage) => stage.active)
      .map((stage) => stage.stageName);

    const displayedJobs = getDisplayedJobs(
      savedJobs,
      pages.currentPage,
      searchText,
      filteredStages,
      true,
      true,
      true
    );
    setDisplayedJobs(displayedJobs);

    //update filteringStages stages with job counts
    const updatedStages = filteringStages.map((stage) => {
      const jobsInStage = getDisplayedJobs(
        savedJobs,
        pages.currentPage,
        searchText,
        [stage.stageName],
        true,
        true,
        false
      );
      return {
        ...stage,
        jobCount: jobsInStage.length,
      };
    });
    // console.log(updatedStages);
    setFilteringStages(updatedStages);
  }, [savedJobs]);

  const handleSearchJobs = (query: string) => {
    //after every search reset page number back to 1 (first page)
    const filteredStages = filteringStages
      .filter((stage) => stage.active)
      .map((stage) => stage.stageName);

    const displayedJobs = getDisplayedJobs(
      savedJobs,
      1,
      query,
      filteredStages,
      true,
      true,
      true
    );
    setDisplayedJobs(displayedJobs);
  };

  const fetchPage = (page: number) => {
    const filteredStages = filteringStages
      .filter((stage) => stage.active)
      .map((stage) => stage.stageName);

    const displayedJobs = getDisplayedJobs(
      savedJobs,
      page,
      searchText,
      filteredStages,
      true,
      true,
      true
    );
    setDisplayedJobs(displayedJobs);
  };

  const handleFilterJobs = (modifiedStage: FilteringStage, active: boolean) => {
    //1. update stage active to true/false
    const updatedFilteringStages = filteringStages.map((stage) => {
      if (stage.stageName === modifiedStage.stageName) {
        stage.active = active;
      }
      return stage;
    });

    //2. update filtering stages
    setFilteringStages(updatedFilteringStages);

    //3. getDisplayedJobs and set displayed jobs stage
    const filteredStages = updatedFilteringStages
      .filter((stage) => stage.active)
      .map((stage) => stage.stageName);

    const displayedJobs = getDisplayedJobs(
      savedJobs,
      1,
      searchText,
      filteredStages,
      true,
      true,
      true
    );
    setDisplayedJobs(displayedJobs);
  };

  return (
    <div className="h-full">
      <div className="border-[#dce6f8] border-b-[1px] bg-white h-[64px]">
        <div className="flex items-center justify-between max-w-[1450px] w-full px-4 mx-auto py-3">
          <div className="w-full flex items-center justify-between">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="text-sm font-medium text-[#3d3d3d] hover:text-[#3d3d3d] px-2 bg-white"
                  variant="outlinePrimary"
                >
                  <SlidersHorizontal size={20} className="mr-1" />
                  All Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="p-0 m-0 rounded-md shadow-md w-[300px]"
                sideOffset={6}
                align="start"
              >
                <JobFilter
                  filteringStages={filteringStages}
                  handleFilterJobs={handleFilterJobs}
                />
              </PopoverContent>
            </Popover>
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
            <p className="text-sm font-medium">
              {pages.totalJobCount} saved jobs
            </p>
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
            displayedJobs.map((job) => (
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

        {displayedJobs.length === 0 && savedJobsStatus !== "pending" && (
          <div className="flex items-center justify-center w-full h-60">
            <p className="text-lg font-medium text-gray-400">No jobs found</p>
          </div>
        )}
      </div>

      {pages.totalPages > 1 && savedJobsStatus !== "pending" && (
        <PaginationBox
          totalPages={pages.totalPages || 1}
          currentPage={pages.currentPage || 1}
          fetchPage={fetchPage}
        />
      )}
    </div>
  );
};

export default SavedJobsPage;
