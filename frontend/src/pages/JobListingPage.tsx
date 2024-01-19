import React, { useEffect, useState } from "react";
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
  Bell,
  BellRing,
} from "lucide-react";
import JobItem from "@/components/jobs/JobItem";
import { Separator } from "@/components/ui/separator";
import PaginationBox from "@/components/pagination/PaginationBox";

import axios from "@/lib/axiosConfig";
import { useModal } from "@/hooks/zustand/useModal";

import ScrapedSite from "@/types/ScrapedSite";
import JobListing from "@/types/JobListing";

import { SEEK, GRAD_CONNECTION } from "@/utils/constants";

const JobListingPage = () => {
  const [scrapedSites, setScrapedSites] = useState<ScrapedSite[]>([]);
  const [currentScrapedSite, setCurrentScrapedSite] = useState<ScrapedSite>();

  //maps page number to site id
  const [pageSiteMapping, setPageSiteMapping] = useState<
    { currentPage: number; siteId: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { onOpen } = useModal();

  useEffect(() => {
    const fetchScrapedSites = async () => {
      setIsLoading(true);
      const res = await axios.get("/scraped-sites");
      setIsLoading(false);
      console.log(res.data);
      setScrapedSites(res.data);
      setCurrentScrapedSite(res.data[0]);

      //set pageSiteMapping
      const pageSiteMapping = res.data.map((site: ScrapedSite) => {
        return { currentPage: 1, siteId: site.id };
      });
      setPageSiteMapping(pageSiteMapping);
    };
    fetchScrapedSites();
  }, []);

  const scrapeSite = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `/scraped-sites/${currentScrapedSite?.id}/scrape`
      );
      setIsLoading(false);
      const updatedScrapedSite = res.data;
      console.log(updatedScrapedSite);

      //update scrapedSites and currentScrapedSite
      const updatedScrapedSites = scrapedSites.map((site) => {
        if (site.id === updatedScrapedSite.id) {
          return updatedScrapedSite;
        }
        return site;
      });
      setScrapedSites(updatedScrapedSites);
      setCurrentScrapedSite(updatedScrapedSite);

      //set currentPage to 1 for the updated site
      const updatedPageSiteMapping = pageSiteMapping.map((mapping) => {
        if (mapping.siteId === updatedScrapedSite.id) {
          return { ...mapping, currentPage: 1 };
        }
        return mapping;
      });
      setPageSiteMapping(updatedPageSiteMapping);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPage = async (page: number) => {
    try {
      const res = await axios.get(
        `/job-listings/${currentScrapedSite?.id}?page=${page}&per_page=30`
      );
      const jobListings: JobListing[] = res.data;

      if (currentScrapedSite) {
        const updatedScrapedSite = {
          ...currentScrapedSite,
          job_listings: jobListings,
        };
        setCurrentScrapedSite(updatedScrapedSite);

        //update scrapedSites
        const updatedScrapedSites = scrapedSites.map((site) => {
          if (site.id === updatedScrapedSite.id) {
            return updatedScrapedSite;
          }
          return site;
        });
        setScrapedSites(updatedScrapedSites);

        //update pageSiteMapping
        const updatedPageSiteMapping = pageSiteMapping.map((mapping) => {
          if (mapping.siteId === currentScrapedSite.id) {
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
              onValueChange={(value) => {
                console.log(value);
                const selectedScrapedSite = scrapedSites.find(
                  (site) => site.website_name === value
                );
                setCurrentScrapedSite(selectedScrapedSite);
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
            <Button
              className="text-sm font-medium text-[#3d3d3d] hover:text-[#3d3d3d] px-2 bg-white"
              variant="outlinePrimary"
            >
              <SlidersHorizontal size={20} />
            </Button>
          </div>
        </div>
        <Separator className="my-2" />
        {/* grid 2 cols */}
        {/* <div className="flex items-center flex-wrap justify-around"> */}
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
              />
            );
          })}
        </div>
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
    </div>
  );
};

export default JobListingPage;
