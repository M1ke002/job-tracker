import {
  Briefcase,
  ChevronDownCircle,
  CircleDollarSign,
  FileEdit,
  MapPin,
  Trash,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import Note from "@/components/note/Note";
import Contact from "@/components/contact/Contact";
import Task from "@/components/task/Task";
import JobDescription from "@/components/job-description/JobDescription";

import { useModal } from "@/hooks/zustand/useModal";
import axios from "@/lib/axiosConfig";
import SavedJob from "@/types/SavedJob";
import { useParams } from "react-router-dom";

const JobDetails = () => {
  const [job, setJob] = useState<SavedJob | null>(null);
  const [isLoading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { onOpen } = useModal();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await axios.get(`/saved-jobs/${id}`);
        setJob(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchJobDetails();
  }, []);

  const changeJobStage = async (stage_name: string) => {
    try {
      setLoading(true);
      const res = await axios.put(`/saved-jobs/${id}/stage`, {
        stageName: stage_name,
      });
      setLoading(false);
      setJob(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-auto my-4 px-4 flex flex-col items-center max-w-[1450px] space-y-4">
      {/* header (company name, job details) */}
      <div className="flex flex-col p-6 bg-white border border-[#dbe9ff] w-full shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-end space-x-3">
            <h2 className="text-3xl font-semibold">{job?.job_title}</h2>
            <div className="flex items-center space-x-1">
              <button className="border-none focus:outline-none text-blue-700 hover:text-blue-700/80">
                <FileEdit size={20} />
              </button>
              <button
                className="border-none focus:outline-none text-rose-500 hover:text-rose-500/80"
                onClick={() => {
                  onOpen("deleteJob", {
                    confirmModalTitle: "Delete job",
                    confirmModalMessage:
                      "Are you sure you want to delete this job?",
                    confirmModalAction: () => {},
                    confirmModalConfirmButtonText: "Delete",
                  });
                }}
              >
                <Trash size={20} />
              </button>
            </div>
          </div>

          <Select onValueChange={(value) => changeJobStage(value)}>
            <SelectTrigger
              className="w-[150px] border-blue-200"
              disabled={isLoading}
            >
              <SelectValue
                placeholder={job?.stage?.stage_name || "Status: Not set"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None">Not set</SelectItem>
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="O.A.">O.A.</SelectItem>
              <SelectItem value="Interview">Interview</SelectItem>
              <SelectItem value="Offer">Offer</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg text-gray-700 font-semibold">
              {job?.company_name}
            </h3>
            <span className="text-gray-700">—</span>
            <span className="text-gray-700">{job?.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center flex-wrap space-x-6">
            <div>
              {/* <span className="text-gray-700 mr-1">View job posting</span> */}
              <a
                href={job?.job_url}
                target="_blank"
                className="text-blue-700 underline hover:text-blue-700/80"
              >
                View job posting
              </a>
            </div>

            <div className="flex items-center">
              <MapPin className="mr-2 text-blue-700" size={18} />
              <span className="text-gray-700">{job?.location || "N/A"}</span>
            </div>

            <div className="flex items-center">
              <CircleDollarSign className="mr-2 text-blue-700" size={18} />
              <span className="text-gray-700">{job?.salary || "N/A"}</span>
            </div>

            <div className="flex items-center">
              <Briefcase className="mr-2 text-blue-700" size={18} />
              <span className="text-gray-700">
                {job?.additional_info || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2 main cols, left col - 2/3: for job description. Right  col-1/3: for notes, contacts, etcc*/}
      <div className="lg:grid grid-cols-5 gap-4 w-full">
        {/* left col */}
        <div className="col-span-3 space-y-4 mb-4 lg:mb-0">
          <JobDescription />
          <Task />
        </div>

        {/* right col */}
        <div className="col-span-2 space-y-4">
          <div className="p-6 bg-white border border-[#dbe9ff] w-full shadow-sm space-y-4">
            <Note />
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
