import React from "react";
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

const JobList = () => {
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
              15 jobs on{" "}
              <a
                href="https://au.indeed.com/"
                target="_blank"
                className="underline text-blue-500"
              >
                Indeed
              </a>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Last updated: 2 days ago</p>
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
          <JobItem type="job" />
          <JobItem type="job" />
          <JobItem type="job" />
          <JobItem type="job" />
          <JobItem type="job" />
        </div>
        <PaginationBox />
      </div>
    </div>
  );
};

export default JobList;
