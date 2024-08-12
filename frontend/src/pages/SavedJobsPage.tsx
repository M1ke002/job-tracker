import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, SlidersHorizontal } from "lucide-react";

import axios from "@/lib/axiosConfig";
import JobItem from "@/components/jobs/JobItem";
import JobItemSkeleton from "@/components/skeleton/JobItemSkeleton";
import SearchBox from "@/components/search/SearchBox";
import PaginationBox from "@/components/pagination/PaginationBox";
import { paginateJobs, searchJobs } from "@/utils/utils";

import { useQuery } from "@tanstack/react-query";

import { useSavedJobs } from "@/stores/useSavedJobs";
import { useModal } from "@/stores/useModal";
import { useSavedJobsQuery } from "@/hooks/queries/useSavedJobsQuery";

const PER_PAGE = 20;

const SavedJobsPage = () => {
  const { savedJobs, setSavedJobs } = useSavedJobs();
  const { onOpen } = useModal();

  const { data: savedJobsData, status: savedJobsStatus } = useSavedJobsQuery();

  //for searching jobs
  const [searchText, setSearchText] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Local state to display the filtered/paginated jobs
  const [displayedJobs, setDisplayedJobs] = useState(savedJobs);

  //pagination data
  const [pages, setPages] = useState({
    totalPages: 1,
    totalJobCount: savedJobs.length,
    currentPage: 1,
  });

  //set savedJobsData and displayedJobs after fetching from api
  useEffect(() => {
    if (savedJobsData) {
      setSavedJobs(savedJobsData);
      const paginationResult = paginateJobs(
        savedJobsData,
        pages.currentPage,
        PER_PAGE,
        searchText
      );
      setPages((prev) => {
        return {
          ...prev,
          totalPages: paginationResult.totalPages,
          totalJobCount: paginationResult.totalJobCount,
        };
      });
      setDisplayedJobs(paginationResult.paginatedJobs);
    }
  }, [savedJobsData]);

  //update displayedJobs when savedJobs state changes(eg new job added/job deleted)
  useEffect(() => {
    const paginationResult = paginateJobs(
      savedJobs,
      pages.currentPage,
      PER_PAGE,
      searchText
    );
    setPages((prev) => {
      return {
        ...prev,
        totalPages: paginationResult.totalPages,
        totalJobCount: paginationResult.totalJobCount,
      };
    });
    setDisplayedJobs(paginationResult.paginatedJobs);
  }, [savedJobs]);

  const handleSearchJobs = (query: string) => {
    const searchResult = searchJobs(savedJobs, query, PER_PAGE);
    setDisplayedJobs(searchResult.paginatedJobs);
    setPages({
      totalPages: searchResult.totalPages,
      totalJobCount: searchResult.totalJobCount,
      currentPage: 1,
    });
  };

  const fetchPage = (page: number) => {
    const paginationResult = paginateJobs(
      savedJobs,
      page,
      PER_PAGE,
      searchText
    );
    setPages({
      totalPages: paginationResult.totalPages,
      totalJobCount: paginationResult.totalJobCount,
      currentPage: page,
    });
    setDisplayedJobs(paginationResult.paginatedJobs);
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
