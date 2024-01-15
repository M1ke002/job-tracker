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
import { Link } from "react-router-dom";
import JobItem from "@/components/jobs/JobItem";
import { Separator } from "@/components/ui/separator";
import PaginationBox from "@/components/pagination/PaginationBox";

import axios from "@/lib/axiosConfig";
import ScrapedSite from "@/types/ScrapedSite";

const JobListingPage = () => {
  const [scrapedSites, setScrapedSites] = useState<ScrapedSite[]>([]);
  const [currentScrapedSite, setCurrentScrapedSite] = useState<ScrapedSite>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchScrapedSites = async () => {
      setIsLoading(true);
      const res = await axios.get("/scraped-sites");
      setIsLoading(false);
      console.log(res.data);
      setScrapedSites(res.data);
      setCurrentScrapedSite(res.data[0]);
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

      //update scrapedSites and currentScrapedSite
      const updatedScrapedSites = scrapedSites.map((site) => {
        if (site.id === updatedScrapedSite.id) {
          return updatedScrapedSite;
        }
        return site;
      });
      setScrapedSites(updatedScrapedSites);
      setCurrentScrapedSite(updatedScrapedSite);
    } catch (error) {
      console.log(error);
    }
  };

  // if (scrapedSites.length === 0 || !currentScrapedSite) {
  //   return null;
  // }

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
            <Button className="flex items-center" variant="primary">
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
              {currentScrapedSite?.job_listings.length} jobs on{" "}
              <a
                href={
                  currentScrapedSite?.website_name === "Grad Connection"
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
        <PaginationBox />
      </div>
    </div>
  );
};

export default JobListingPage;
