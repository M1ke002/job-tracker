import JobItem from "@/components/jobs/JobItem";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { Plus, SlidersHorizontal } from "lucide-react";

const SavedJobs = () => {
  return (
    <div className="relative mx-auto px-4 flex flex-col max-w-[1450px] min-h-[calc(100vh-60px)]">
      <div className="w-full flex items-center justify-between mt-4">
        <p className="text-sm font-medium">Showing 23/42 jobs</p>
        <div className="flex items-center space-x-2">
          <Button variant="primary" className="flex items-center">
            <Plus size={20} className="mr-1" />
            Add job
          </Button>
          <Button
            className="text-sm font-medium text-[#3d3d3d] hover:text-[#3d3d3d] px-2 bg-white"
            variant="outlinePrimary"
          >
            <SlidersHorizontal size={20} />
          </Button>
        </div>
      </div>
      <Separator className="my-3" />
      <div className="grid md:grid-cols-2 gap-2 grid-cols-1 justify-items-center">
        <JobItem type="savedJob" />
        <JobItem type="savedJob" />
        <JobItem type="savedJob" />
        <JobItem type="savedJob" />
        <JobItem type="savedJob" />
      </div>
      <Button className="mx-auto mt-4 mb-3 px-7" variant="primary">
        Load More
      </Button>

      {/* floating absolute add btn at bottom corner of screen */}
      {/* <div className="fixed bottom-0 right-0 mb-5 mr-5">
        <Button variant="primary" className="rounded-full flex items-center ">
          <Plus size={20} className="mr-1" />
          Add job
        </Button>
      </div> */}
    </div>
  );
};

export default SavedJobs;
