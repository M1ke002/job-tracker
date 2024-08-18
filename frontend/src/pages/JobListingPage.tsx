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

import { debounce } from "lodash";
import axios from "@/lib/axiosConfig";
import {
  SEEK,
  GRAD_CONNECTION,
  GRAD_CONNECTION_URL,
  SEEK_URL,
} from "@/constant/scrapedSite";

import { useQuery } from "@tanstack/react-query";
import { useModal } from "@/stores/useModal";
import { useScrapedSites } from "@/stores/useScrapedSites";
import { useCurrentScrapedSiteId } from "@/stores/useCurrentScrapedSiteId";
import { useSavedJobs } from "@/stores/useSavedJobs";
import { useScrapedSitesQuery } from "@/hooks/queries/useScrapedSitesQuery";
import { useSavedJobsQuery } from "@/hooks/queries/useSavedJobsQuery";

const buildJobSearchQuery = (
  initialQuery: string,
  searchText: string,
  page: number = 1
) => {
  let query = initialQuery;
  query += searchText ? `/search?query=${searchText}&` : "?";
  query += `page=${page}&per_page=30`;
  return query;
};

const JobListingPage = () => {
  const { savedJobs, setSavedJobs } = useSavedJobs();
  const { scrapedSites, setScrapedSites } = useScrapedSites();
  const { currentScrapedSiteId, setCurrentScrapedSiteId } =
    useCurrentScrapedSiteId();
  const { onOpen } = useModal();
  const [currentScrapedSite, setCurrentScrapedSite] =
    useState<ScrapedSite | null>(scrapedSites[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //for searching jobs
  const [searchText, setSearchText] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  //maps page number to site id
  const [pageSiteMapping, setPageSiteMapping] = useState<
    { currentPage: number; siteId: number }[]
  >([]);

  //fetch scraped sites data (containing job listings) and saved jobs data
  const { data: scrapedSitesData, status: scrapedSitesStatus } =
    useScrapedSitesQuery();
  const { data: savedJobsData, status: savedJobsStatus } = useSavedJobsQuery();

  //set currentScrapedSite to match with currentScrapedSiteId
  useEffect(() => {
    const currentScrapedSite = scrapedSites.find((site) => {
      return site.id.toString() === currentScrapedSiteId;
    });
    if (currentScrapedSite) {
      setCurrentScrapedSite(currentScrapedSite);
    }
  }, [currentScrapedSiteId, scrapedSites]);

  useEffect(() => {
    if (scrapedSitesData) {
      //set scrapedSitesData after fetching from api
      setScrapedSites(scrapedSitesData);

      //set default currentScrapedSiteId to the first site
      const defaultScrapedSite = scrapedSitesData[0];
      const defaultScrapedSiteId = defaultScrapedSite.id.toString();
      setCurrentScrapedSiteId(defaultScrapedSiteId);

      //set pageSiteMapping
      const pageSiteMapping = scrapedSitesData.map((site: ScrapedSite) => {
        return { currentPage: 1, siteId: site.id };
      });
      setPageSiteMapping(pageSiteMapping);
    }
  }, [scrapedSitesData]);

  //set savedJobsData after fetching from api
  useEffect(() => {
    if (savedJobsData) {
      setSavedJobs(savedJobsData);
    }
  }, [savedJobsData]);

  useEffect(() => {
    //scroll to top of page when currentScrapedSite changes
    window.scrollTo(0, 0);
  }, [currentScrapedSite]);

  //call api to search jobs
  const searchJobs = useCallback(
    async (searchText: string) => {
      try {
        if (!currentScrapedSiteId) return;

        setIsSearching(true);
        console.log("searching jobs with text: ", searchText);

        const initialQuery = `/job-listings/${currentScrapedSiteId}`;
        const query = buildJobSearchQuery(initialQuery, searchText, 1);
        const res = await axios.get(query);

        const jobListings: JobListing[] = res.data[0];
        const totalPages: number = res.data[1];
        const totalJobCount: number = res.data[2];

        //update scrapedSites with new data
        const updatedScrapedSites = scrapedSites.map((site) => {
          if (site.id.toString() === currentScrapedSiteId) {
            return {
              ...site,
              job_listings: jobListings,
              total_pages: totalPages,
              total_job_count: totalJobCount,
            };
          }
          return site;
        });
        setScrapedSites(updatedScrapedSites);

        //update pageSiteMapping to reset currentPage to 1
        setPageSiteMapping((prev) => {
          const updatedPageSiteMapping = prev.map((mapping) =>
            mapping.siteId.toString() === currentScrapedSiteId
              ? { ...mapping, currentPage: 1 }
              : mapping
          );
          return updatedPageSiteMapping;
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsSearching(false);
      }
    },
    [currentScrapedSiteId, scrapedSites, setScrapedSites, setPageSiteMapping]
  );

  const debouncedSearchJobs = useMemo(
    () => debounce(searchJobs, 1000),
    [searchJobs]
  );

  const handleSearchJobs = (value: string) => {
    if (currentScrapedSiteId) {
      debouncedSearchJobs(value);
    }
  };

  const handleSelectScrapedSite = (value: string) => {
    console.log(value);
    const selectedScrapedSite = scrapedSites.find(
      (site) => site.website_name === value
    );
    if (selectedScrapedSite) {
      setCurrentScrapedSiteId(selectedScrapedSite.id.toString());
    }

    //reset searchText to empty
    if (searchText !== "") {
      setSearchText("");
      handleSearchJobs("");
    }
  };

  const scrapeSite = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `/scraped-sites/${currentScrapedSite?.id}/scrape`
      );
      setIsLoading(false);
      const updatedScrapedSite = res.data;
      console.log(updatedScrapedSite);

      //update scrapedSites
      const updatedScrapedSites = scrapedSites.map((site) => {
        if (site.id === updatedScrapedSite.id) {
          return updatedScrapedSite;
        }
        return site;
      });
      setScrapedSites(updatedScrapedSites);

      //reset currentPage back to 1 for the updated site
      const updatedPageSiteMapping = pageSiteMapping.map((mapping) => {
        if (mapping.siteId === updatedScrapedSite.id) {
          return { ...mapping, currentPage: 1 };
        }
        return mapping;
      });
      setPageSiteMapping(updatedPageSiteMapping);

      //reset searchText
      setSearchText("");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPage = async (page: number) => {
    try {
      if (!currentScrapedSiteId) return;

      const initialQuery = `/job-listings/${currentScrapedSiteId}`;
      const query = buildJobSearchQuery(initialQuery, searchText, page);
      const res = await axios.get(query);
      console.log("res", res.data);

      const jobListings: JobListing[] = res.data[0];
      const totalPages: number = res.data[1];
      const totalJobCount: number = res.data[2];

      //update scrapedSites with new data
      const updatedScrapedSites = scrapedSites.map((site) => {
        if (site.id.toString() === currentScrapedSiteId) {
          return {
            ...site,
            job_listings: jobListings,
            total_pages: totalPages,
            total_job_count: totalJobCount,
          };
        }
        return site;
      });
      setScrapedSites(updatedScrapedSites);

      //update pageSiteMapping with new currentPage
      setPageSiteMapping((prev) => {
        const updatedPageSiteMapping = prev.map((mapping) =>
          mapping.siteId.toString() === currentScrapedSiteId
            ? { ...mapping, currentPage: page }
            : mapping
        );
        return updatedPageSiteMapping;
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-full">
      <div className="border-[#dce6f8] border-b-[1px] bg-white h-[64px]">
        <div className="flex items-center justify-between max-w-[1450px] w-full px-4 mx-auto py-3">
          <div className="flex items-center space-x-3">
            <Select
              disabled={isLoading || isSearching}
              onValueChange={handleSelectScrapedSite}
            >
              <SelectTrigger className="w-[150px] border-blue-200">
                <SelectValue placeholder={currentScrapedSite?.website_name} />
              </SelectTrigger>
              <SelectContent>
                {scrapedSites.map((site, index) => {
                  return (
                    <SelectItem key={index} value={site.website_name}>
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
              onClick={() =>
                onOpen("editJobAlertSetting", {
                  alertSetting: currentScrapedSite?.scraped_site_settings,
                  websiteName: currentScrapedSite?.website_name,
                })
              }
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
                {currentScrapedSite?.total_job_count} jobs on{" "}
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
              setSearchText={setSearchText}
              isSearching={isSearching}
              onSearch={handleSearchJobs}
              placeholder="Search jobs"
            />
          </div>
        </div>
        <Separator className="my-2" />

        <div className="grid md:grid-cols-2 gap-2 grid-cols-1 justify-items-center">
          {scrapedSitesStatus === "pending" || savedJobsStatus === "pending" ? (
            <>
              <JobItemSkeleton />
              <JobItemSkeleton />
              <JobItemSkeleton />
              <JobItemSkeleton />
            </>
          ) : (
            currentScrapedSite?.job_listings.map((job, index) => {
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
                  isSaved={savedJobs.some(
                    (savedJob) =>
                      savedJob.job_url === job.job_url &&
                      savedJob.company_name === job.company_name &&
                      savedJob.job_title === job.job_title
                  )}
                />
              );
            })
          )}
        </div>
        {currentScrapedSite?.job_listings.length === 0 &&
          scrapedSitesStatus !== "pending" && (
            <div className="flex items-center justify-center w-full h-60">
              <p className="text-lg font-medium text-gray-400">No jobs found</p>
            </div>
          )}
        {currentScrapedSite &&
          currentScrapedSite?.total_pages > 1 &&
          scrapedSitesStatus !== "pending" && (
            <PaginationBox
              totalPages={currentScrapedSite.total_pages || 1}
              currentPage={
                pageSiteMapping.find(
                  (mapping) => mapping.siteId === currentScrapedSite.id
                )?.currentPage || 1
              }
              fetchPage={fetchPage}
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
