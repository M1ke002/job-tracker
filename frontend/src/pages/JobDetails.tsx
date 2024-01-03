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
import React from "react";
import Note from "@/components/note/Note";
import Contact from "@/components/contact/Contact";
import Task from "@/components/task/Task";
import JobDescription from "@/components/job-description/JobDescription";

import { useModal } from "@/hooks/zustand/useModal";

const JobDetails = () => {
  const { onOpen } = useModal();
  return (
    <div className="mx-auto my-4 px-4 flex flex-col items-center max-w-[1450px] space-y-4">
      {/* header (company name, job details) */}
      <div className="flex flex-col p-6 bg-white border border-[#dbe9ff] w-full shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-end space-x-3">
            <h2 className="text-3xl font-semibold">
              Full Stack Software Engineer
            </h2>
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

          <Select>
            <SelectTrigger className="w-[150px] border-blue-200">
              <SelectValue placeholder="Status: Not set" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Not set</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg text-gray-700 font-semibold">
              Susquehanna International Group, LLP (SIG)
            </h3>
            <span className="text-gray-700">—</span>
            <span className="text-gray-700">
              Sydney, New South Wales, Australia
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center flex-wrap space-x-6">
            <div>
              {/* <span className="text-gray-700 mr-1">View job posting</span> */}
              <a
                href="https://au.indeed.com/"
                target="_blank"
                className="text-blue-700 underline hover:text-blue-700/80"
              >
                View job posting
              </a>
            </div>

            <div className="flex items-center">
              <MapPin className="mr-2 text-blue-700" size={18} />
              <span className="text-gray-700">Sydney, NSW</span>
            </div>

            <div className="flex items-center">
              <CircleDollarSign className="mr-2 text-blue-700" size={18} />
              <span className="text-gray-700">$60,000 - $70,000 a year</span>
            </div>

            <div className="flex items-center">
              <Briefcase className="mr-2 text-blue-700" size={18} />
              <span className="text-gray-700">Internship, full-time</span>
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
