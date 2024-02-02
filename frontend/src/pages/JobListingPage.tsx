import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  SlidersHorizontal,
  RefreshCcw,
  BellRing,
  Search,
  Loader2,
  ChevronDown,
} from "lucide-react";
import JobItem from "@/components/jobs/JobItem";
import { Separator } from "@/components/ui/separator";
import PaginationBox from "@/components/pagination/PaginationBox";

import axios from "@/lib/axiosConfig";
import { useModal } from "@/hooks/zustand/useModal";
import { useScrapedSites } from "@/hooks/zustand/useScrapedSites";
import { useCurrentScrapedSiteId } from "@/hooks/zustand/useCurrentScrapedSiteId";
import { useSavedJobs } from "@/hooks/zustand/useSavedJobs";

import ScrapedSite from "@/types/ScrapedSite";
import JobListing from "@/types/JobListing";

import { SEEK, GRAD_CONNECTION } from "@/utils/constants";
import ScrollToTopBtn from "@/components/ScrollToTopBtn";

const JobListingPage = () => {
  const { savedJobs, setSavedJobs } = useSavedJobs();
  const { scrapedSites, setScrapedSites } = useScrapedSites();
  const { currentScrapedSiteId, setCurrentScrapedSiteId } =
    useCurrentScrapedSiteId();
  const [currentScrapedSite, setCurrentScrapedSite] =
    useState<ScrapedSite | null>(null);

  //for searching jobs
  const [searchText, setSearchText] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  //maps page number to site id
  const [pageSiteMapping, setPageSiteMapping] = useState<
    { currentPage: number; siteId: number }[]
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { onOpen } = useModal();

  useEffect(() => {
    const currentScrapedSite = scrapedSites.find((site) => {
      return site.id.toString() === currentScrapedSiteId;
    });
    if (currentScrapedSite) {
      setCurrentScrapedSite(currentScrapedSite);
    }
  }, [currentScrapedSiteId, scrapedSites]);

  useEffect(() => {
    const fetchScrapedSites = async () => {
      setIsLoading(true);
      const res = await axios.get("/scraped-sites");
      setIsLoading(false);
      console.log(res.data);
      setScrapedSites(res.data);

      //set default currentScrapedSiteId to the first site
      setCurrentScrapedSiteId(res.data[0].id.toString());

      //set pageSiteMapping
      const pageSiteMapping = res.data.map((site: ScrapedSite) => {
        return { currentPage: 1, siteId: site.id };
      });
      setPageSiteMapping(pageSiteMapping);
    };
    fetchScrapedSites();
  }, []);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        // if (isFetched) return;
        const res = await axios.get("/saved-jobs");
        console.log(res.data);
        setSavedJobs(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSavedJobs();
  }, []);

  useEffect(() => {
    //scroll to top of page when currentScrapedSite changes
    window.scrollTo(0, 0);
  }, [currentScrapedSite]);

  //call api to search jobs
  const searchJobs = useCallback(
    async (
      searchText: string,
      currentScrapedSiteId: string,
      scrapedSites: ScrapedSite[]
    ) => {
      try {
        setIsSearching(true);
        console.log("searching jobs with text: ", searchText);
        let query = `/job-listings/${currentScrapedSiteId}`;
        if (searchText !== "") {
          query += `/search?query=${searchText}&`;
        } else {
          query += "?";
        }
        query += `page=1&per_page=30`;
        const res = await axios.get(query);
        setIsSearching(false);

        const jobListings: JobListing[] = res.data[0];
        const totalPages: number = res.data[1];
        const totalJobCount: number = res.data[2];

        if (currentScrapedSiteId) {
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
            const updatedPageSiteMapping = prev.map((mapping) => {
              if (mapping.siteId.toString() === currentScrapedSiteId) {
                return { ...mapping, currentPage: 1 };
              }
              return mapping;
            });
            return updatedPageSiteMapping;
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    []
  );

  const debouncedSearchJobs = useMemo(() => {
    return debounce(searchJobs, 1000);
  }, [searchJobs]);

  const handleSearchTextChange = (value: string) => {
    setSearchText(value);
    if (currentScrapedSiteId) {
      debouncedSearchJobs(value, currentScrapedSiteId, scrapedSites);
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
      let query = `/job-listings/${currentScrapedSiteId}`;
      if (searchText !== "") {
        query += `/search?query=${searchText}&`;
      } else {
        query += "?";
      }
      query += `page=${page}&per_page=30`;
      const res = await axios.get(query);
      const jobListings: JobListing[] = res.data[0];
      const totalPages: number = res.data[1];
      const totalJobCount: number = res.data[2];
      console.log("res", res.data);

      if (currentScrapedSiteId) {
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
        const updatedPageSiteMapping = pageSiteMapping.map((mapping) => {
          if (mapping.siteId.toString() === currentScrapedSiteId) {
            return { ...mapping, currentPage: page };
          }
          return mapping;
        });
        setPageSiteMapping(updatedPageSiteMapping);
      }
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
              onValueChange={(value) => {
                console.log(value);
                const selectedScrapedSite = scrapedSites.find(
                  (site) => site.website_name === value
                );
                if (selectedScrapedSite) {
                  setCurrentScrapedSiteId(selectedScrapedSite.id.toString());
                }

                //reset searchText
                if (searchText !== "") handleSearchTextChange("");
              }}
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
            {/* <Button
              className="text-sm font-medium text-[#3d3d3d] hover:text-[#3d3d3d]"
              variant="outlinePrimary"
            >
              Compare
            </Button> */}
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
            <p className="text-sm font-medium">
              {currentScrapedSite?.total_job_count} jobs on{" "}
              <a
                href={
                  currentScrapedSite?.website_name === GRAD_CONNECTION
                    ? "https://au.gradconnection.com/"
                    : "https://www.seek.com.au/"
                }
                target="_blank"
                className="underline text-blue-500"
              >
                {currentScrapedSite?.website_name}{" "}
              </a>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">
              Last updated: {currentScrapedSite?.last_scrape_date}
            </p>
            <Button
              className="text-sm font-medium text-[#3d3d3d] hover:text-[#3d3d3d] px-2 bg-white"
              variant="outlinePrimary"
              disabled={isLoading}
              onClick={scrapeSite}
            >
              <RefreshCcw size={20} />
            </Button>
            <div className="relative flex items-center justify-between">
              <input
                type="text"
                placeholder="Search jobs"
                className="text-sm rounded-sm border-blue-300 border-[1px] pl-3 pr-9 py-2 w-[230px] h-[40px]"
                value={searchText}
                onChange={(e) => handleSearchTextChange(e.target.value)}
              />
              {isSearching ? (
                <div className="absolute right-2">
                  <Loader2
                    size={20}
                    className="mr-1 animate-spin text-[#3d3d3d]"
                  />
                </div>
              ) : (
                <Search
                  size={20}
                  className="mr-1 absolute right-2 text-[#3d3d3d] cursor-pointer h-full"
                />
              )}
            </div>
          </div>
        </div>
        <Separator className="my-2" />

        <div className="grid md:grid-cols-2 gap-2 grid-cols-1 justify-items-center">
          {currentScrapedSite?.job_listings.map((job, index) => {
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
          })}
        </div>
        {currentScrapedSite?.job_listings.length === 0 && (
          <div className="flex items-center justify-center w-full h-60">
            <p className="text-lg font-medium text-gray-400">No jobs found</p>
          </div>
        )}
        {currentScrapedSite && currentScrapedSite?.total_pages > 1 && (
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
