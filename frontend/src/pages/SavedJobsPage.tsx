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
import React, { useEffect } from "react";
import { Plus, SlidersHorizontal } from "lucide-react";
import { useSavedJobs } from "@/hooks/zustand/useSavedJobs";
import axios from "@/lib/axiosConfig";
import { useModal } from "@/hooks/zustand/useModal";

const SavedJobsPage = () => {
  const { savedJobs, setSavedJobs, isFetched } = useSavedJobs();
  const { onOpen } = useModal();

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

  return (
    <div className="relative mx-auto px-4 flex flex-col max-w-[1450px] min-h-[calc(100vh-60px)]">
      <div className="w-full flex items-center justify-between mt-4">
        <p className="text-sm font-medium">{savedJobs.length} jobs</p>
        <div className="flex items-center space-x-2">
          <Button
            variant="primary"
            className="flex items-center"
            onClick={() => onOpen("createJob")}
          >
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
        {savedJobs.map((job) => (
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
        ))}
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

export default SavedJobsPage;
