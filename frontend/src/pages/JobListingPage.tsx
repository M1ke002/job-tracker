import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";

import {
  Settings,
  SlidersHorizontal,
  RefreshCcw,
  BellRing,
  Search,
  Loader2,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import JobItem from "@/components/jobs/JobItem";
import PaginationBox from "@/components/pagination/PaginationBox";
import ScrollToTopBtn from "@/components/ScrollToTopBtn";
import JobItemSkeleton from "@/components/skeleton/JobItemSkeleton";
import SearchBox from "@/components/search/SearchBox";

import ScrapedSite from "@/types/ScrapedSite";
import JobListing from "@/types/JobListing";
import SavedJob from "@/types/SavedJob";

import { debounce } from "lodash";
import axios from "@/lib/axiosConfig";
import {
  SEEK,
  GRAD_CONNECTION,
  GRAD_CONNECTION_URL,
  SEEK_URL,
} from "@/constant/scrapedSite";

import { useModal } from "@/stores/useModal";
import { useScrapedSitesQuery } from "@/hooks/queries/useScrapedSitesQuery";
import { useSavedJobsQuery } from "@/hooks/queries/useSavedJobsQuery";
import { useQueryClient } from "@tanstack/react-query";
import { useJobListingsQuery } from "@/hooks/queries/useJobListingsQuery";

const JobListingPage = () => {
  const queryClient = useQueryClient();
  const { onOpen } = useModal();
  const [selectedSiteId, setSelectedSiteId] = useState<string | undefined>();
  const [pageNum, setPageNum] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //for searching jobs
  const [searchText, setSearchText] = useState<string>("");
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  //fetch scraped sites data (containing job listings) and saved jobs data
  const { data: scrapedSites, status: scrapedSitesStatus } =
    useScrapedSitesQuery();
  // Fetch job listings for the selected site
  const {
    data: jobListingsData,
    status: jobListingsStatus,
    isPlaceholderData,
  } = useJobListingsQuery(selectedSiteId, pageNum, debouncedSearchText);
  const { data: savedJobs, status: savedJobsStatus } = useSavedJobsQuery();

  // Find the selected site’s details
  const currentScrapedSite = scrapedSites?.find(
    (site) => site.id.toString() === selectedSiteId
  );

  // Set the default site when the scraped sites data is loaded
  useEffect(() => {
    if (scrapedSites && scrapedSites.length > 0 && !selectedSiteId) {
      setSelectedSiteId(scrapedSites[0].id.toString()); // Default to the first site
    }
  }, [scrapedSites]);

  useEffect(() => {
    //scroll to top of page when currentScrapedSite changes
    window.scrollTo(0, 0);
  }, [currentScrapedSite]);

  // Debounce search function
  const debouncedSearchJobs = useCallback(
    debounce((value: string) => {
      setDebouncedSearchText(value);
      setPageNum(1);
    }, 1000), // 1000ms debounce delay
    []
  );

  const handleSearchTextChange = (value: string) => {
    //show text in input field (2 way bindings)
    setSearchText(value);

    if (currentScrapedSite) {
      debouncedSearchJobs(value);
    }
  };

  const handleSelectScrapedSite = (siteId: string) => {
    if (!scrapedSites) return;

    console.log(siteId);

    setSelectedSiteId(siteId);
    //reset pagination page to 1 when changing site
    setPageNum(1);
    //reset searchText to empty
    if (searchText !== "") {
      setSearchText("");
      setDebouncedSearchText("");
    }
  };

  const scrapeSite = async () => {
    try {
      if (!scrapedSites || !currentScrapedSite) return;

      setIsLoading(true);
      const res = await axios.get(
        `/scraped-sites/${currentScrapedSite.id}/scrape`
      );
      setIsLoading(false);
      const updatedScrapedSite = res.data;
      console.log(updatedScrapedSite);

      //update scrapedSites in cache
      queryClient.setQueryData(
        ["scraped-sites"],
        (oldData: ScrapedSite[] | undefined) => {
          if (!oldData) return oldData;

          return oldData.map((site) =>
            site.id === updatedScrapedSite.id ? updatedScrapedSite : site
          );
        }
      );

      //reset currentPage back to 1 for the updated site
      setPageNum(1);

      //reset searchText
      setSearchText("");
      setDebouncedSearchText("");

      // remove old cached job listings
      queryClient.removeQueries({
        queryKey: ["job-listings", selectedSiteId],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPage = async (page: number) => {
    setPageNum(page);
  };

  const handleOpenJobAlertSettingModal = () => {
    if (!currentScrapedSite) return;

    onOpen("editJobAlertSetting", {
      alertSetting: currentScrapedSite.scraped_site_settings,
      websiteName: currentScrapedSite.website_name,
      currentScrapedSiteId: currentScrapedSite.id.toString(),
      scrapedSites,
    });
  };

  const isJobSaved = (
    savedJobs: SavedJob[] | undefined,
    job: JobListing
  ): boolean => {
    if (!savedJobs) return false;

    return savedJobs.some(
      (savedJob) =>
        savedJob.job_url === job.job_url &&
        savedJob.company_name === job.company_name &&
        savedJob.job_title === job.job_title
    );
  };

  return (
    <div className="h-full">
      <div className="border-[#dce6f8] border-b-[1px] bg-white h-[64px]">
        <div className="flex items-center justify-between max-w-[1450px] w-full px-4 mx-auto py-3">
          <div className="flex items-center space-x-3">
            <Select
              disabled={
                isLoading ||
                isSearching ||
                isPlaceholderData ||
                scrapedSitesStatus === "pending" ||
                jobListingsStatus === "pending"
              }
              onValueChange={handleSelectScrapedSite}
            >
              <SelectTrigger className="w-[150px] border-blue-200">
                <SelectValue placeholder={currentScrapedSite?.website_name} />
              </SelectTrigger>
              <SelectContent>
                {scrapedSites &&
                  scrapedSites.map((site) => {
                    return (
                      <SelectItem
                        key={site.id.toString()}
                        value={site.id.toString()}
                      >
                        {site.website_name}
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              className="flex items-center"
              variant="primary"
              onClick={handleOpenJobAlertSettingModal}
            >
              <BellRing size={18} className="mr-2" />
              <span className="pb-[1px]">Alert</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1450px] mx-auto py-3 px-4 min-h-[calc(100vh-60px-24px-64px)]">
        <div className="w-full flex items-center justify-between">
          <div>
            {scrapedSitesStatus === "pending" ? (
              <Skeleton className="w-40 h-8 bg-zinc-200" />
            ) : (
              <p className="text-sm font-medium">
                {jobListingsData?.total_job_count || 0} jobs on{" "}
                <a
                  href={
                    currentScrapedSite?.website_name === GRAD_CONNECTION
                      ? GRAD_CONNECTION_URL
                      : SEEK_URL
                  }
                  target="_blank"
                  className="underline text-blue-500"
                >
                  {currentScrapedSite?.website_name}{" "}
                </a>
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {scrapedSitesStatus === "pending" ? (
              <Skeleton className="bg-zinc-200 w-60 h-8" />
            ) : (
              <p className="text-sm font-medium">
                Last updated: {currentScrapedSite?.last_scrape_date}
              </p>
            )}
            <Button
              className="text-sm font-medium text-[#3d3d3d] hover:text-[#3d3d3d] px-2 bg-white"
              variant="outlinePrimary"
              disabled={isLoading}
              onClick={scrapeSite}
            >
              <RefreshCcw size={20} />
            </Button>

            <SearchBox
              searchText={searchText}
              isSearching={isSearching}
              handleSearchTextChange={handleSearchTextChange}
              placeholder="Search jobs"
            />
          </div>
        </div>
        <Separator className="my-2" />

        <div className="grid md:grid-cols-2 gap-2 grid-cols-1 justify-items-center">
          {scrapedSitesStatus === "pending" ||
          jobListingsStatus === "pending" ? (
            <>
              <JobItemSkeleton />
              <JobItemSkeleton />
              <JobItemSkeleton />
              <JobItemSkeleton />
            </>
          ) : (
            jobListingsData?.job_listings.map((job, index) => {
              return (
                <JobItem
                  key={index}
                  type="jobListing"
                  jobTitle={job.job_title}
                  jobDescription={job.job_description}
                  location={job.location}
                  jobUrl={job.job_url}
                  companyName={job.company_name}
                  additionalInfo={job.additional_info}
                  jobDate={job.job_date}
                  salary={job.salary}
                  isNewJob={job.is_new}
                  savedJobsStatus={savedJobsStatus}
                  isSaved={isJobSaved(savedJobs, job)}
                />
              );
            })
          )}
        </div>
        {jobListingsData &&
          jobListingsData.job_listings.length === 0 &&
          scrapedSitesStatus !== "pending" && (
            <div className="flex items-center justify-center w-full h-60">
              <p className="text-lg font-medium text-gray-400">No jobs found</p>
            </div>
          )}
        {jobListingsData && jobListingsData.total_pages > 1 && (
          <PaginationBox
            totalPages={jobListingsData.total_pages || 1}
            currentPage={pageNum}
            fetchPage={fetchPage}
            disabled={isPlaceholderData}
          />
        )}
      </div>

      <div className="fixed bottom-4 right-4">
        <ScrollToTopBtn />
      </div>
    </div>
  );
};

export default JobListingPage;
