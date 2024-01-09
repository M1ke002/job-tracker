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
import PaginationBox from "@/components/PaginationBox";

import axios from "@/lib/axiosConfig";
import ScrapedSite from "@/types/ScrapedSite";

const JobList = () => {
  const [scrapedSites, setScrapedSites] = useState<ScrapedSite[]>([]);

  useEffect(() => {
    const fetchScrapedSites = async () => {
      const res = await axios.get("/scraped-sites");
      console.log(res.data);
      setScrapedSites(res.data);
    };
    fetchScrapedSites();
  }, []);

  return (
    <div className="h-full">
      <div className="border-[#dce6f8] border-b-[1px] bg-white h-[64px]">
        <div className="flex items-center justify-between max-w-[1450px] w-full px-4 mx-auto py-3">
          <div className="flex items-center space-x-3">
            <Select>
              <SelectTrigger className="w-[150px] border-blue-200">
                <SelectValue placeholder="Indeed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="indeed">Indeed</SelectItem>
                <SelectItem value="gradaus">Grad Australia</SelectItem>
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
              {scrapedSites.length > 0 && scrapedSites[0].job_listings.length}{" "}
              jobs on{" "}
              <a
                href={
                  scrapedSites.length > 0
                    ? scrapedSites[0].website_name === "Grad Connection"
                      ? "https://au.gradconnection.com/"
                      : "https://www.seek.com.au/"
                    : ""
                }
                target="_blank"
                className="underline text-blue-500"
              >
                {scrapedSites.length > 0 && scrapedSites[0].website_name}{" "}
              </a>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">
              Last updated:{" "}
              {scrapedSites.length > 0 && scrapedSites[0].last_scrape_date}
            </p>
            <Button
              className="text-sm font-medium text-[#3d3d3d] hover:text-[#3d3d3d] px-2 bg-white"
              variant="outlinePrimary"
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
          {scrapedSites.length > 0 &&
            scrapedSites[0].job_listings.map((job, index) => {
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

export default JobList;
