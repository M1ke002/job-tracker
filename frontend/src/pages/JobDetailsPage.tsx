import React, { useEffect, useState } from "react";

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

import ApplicationProgress from "@/components/application/ApplicationProgress";
import AttachedDocuments from "@/components/document/AttachedDocuments";
import Note from "@/components/note/Note";
import Contact from "@/components/contact/Contact";
import Task from "@/components/task/Task";
import JobDescription from "@/components/jobs/JobDescription";
import axios from "@/lib/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

import { useModal } from "@/stores/useModal";
import { useCurrentSavedJob } from "@/stores/useCurrentSavedJob";
import { useApplicationStages } from "@/stores/useApplicationStages";

const JobDetailsPage = () => {
  const { applicationStages, setApplicationStages } = useApplicationStages();
  const { currentSavedJob, setCurrentSavedJob } = useCurrentSavedJob();
  const [isLoading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { onOpen } = useModal();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await axios.get(`/saved-jobs/${id}`);
        setCurrentSavedJob(res.data);
        console.log(res.data);
        console.log(res.data.stage?.id);
      } catch (error) {
        console.log(error);
      }
    };
    fetchJobDetails();

    return () => {
      setCurrentSavedJob(null);
    };
  }, []);

  useEffect(() => {
    try {
      const fetchApplicationStages = async () => {
        const res = await axios.get(`/application-stages`);
        setApplicationStages(res.data);
        console.log(res.data);
      };
      fetchApplicationStages();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const changeJobStage = async (stageId: string) => {
    try {
      setLoading(true);
      const res = await axios.put(`/saved-jobs/${id}/stage`, {
        stageId: stageId,
      });
      setLoading(false);
      setCurrentSavedJob(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteJob = async () => {
    try {
      const res = await axios.delete(`/saved-jobs/${id}`);
      setCurrentSavedJob(null);
      navigate("/saved-jobs");
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
            <h2 className="text-3xl font-semibold">
              {currentSavedJob?.job_title}
            </h2>
            <div className="flex items-center space-x-1">
              <button
                className="border-none focus:outline-none text-blue-700 hover:text-blue-700/80"
                onClick={() => onOpen("editJob")}
              >
                <FileEdit size={20} />
              </button>
              <button
                className="border-none focus:outline-none text-rose-500 hover:text-rose-500/80"
                onClick={() => {
                  onOpen("deleteJob", {
                    confirmModalTitle: "Delete job",
                    confirmModalMessage:
                      "Are you sure you want to delete this job?",
                    confirmModalAction: handleDeleteJob,
                    confirmModalConfirmButtonText: "Delete",
                  });
                }}
              >
                <Trash size={20} />
              </button>
            </div>
          </div>

          <Select
            onValueChange={(value) => changeJobStage(value)}
            defaultValue={currentSavedJob?.stage?.id.toString()}
          >
            <SelectTrigger
              className={cn(
                "w-[150px] border-blue-200",
                currentSavedJob?.stage?.stage_name === "O.A." &&
                  "border-[#a3e8f8]",
                currentSavedJob?.stage?.stage_name === "Interviewing" &&
                  "border-amber-200",
                currentSavedJob?.stage?.stage_name === "Offer" &&
                  "border-green-300",
                currentSavedJob?.stage?.stage_name === "Rejected" &&
                  "border-rose-300"
              )}
              disabled={isLoading}
            >
              <SelectValue
                placeholder={
                  currentSavedJob?.stage?.stage_name || "Status: Not set"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None">Not set</SelectItem>
              {applicationStages.map((stage) => (
                <SelectItem key={stage.id} value={stage.id.toString()}>
                  {stage.stage_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg text-gray-700 font-semibold">
              {currentSavedJob?.company_name}
            </h3>
            <span className="text-gray-700">—</span>
            <span className="text-gray-700">{currentSavedJob?.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center flex-wrap space-x-6">
            <div>
              {/* <span className="text-gray-700 mr-1">View job posting</span> */}
              <a
                href={currentSavedJob?.job_url}
                target="_blank"
                className="text-blue-700 underline hover:text-blue-700/80"
              >
                View job posting
              </a>
            </div>

            <div className="flex items-center">
              <MapPin className="mr-2 text-blue-700" size={18} />
              <span className="text-gray-700">
                {currentSavedJob?.location || "N/A"}
              </span>
            </div>

            <div className="flex items-center">
              <CircleDollarSign className="mr-2 text-blue-700" size={18} />
              <span className="text-gray-700">
                {currentSavedJob?.salary || "N/A"}
              </span>
            </div>

            <div className="flex items-center">
              <Briefcase className="mr-2 text-blue-700" size={18} />
              <span className="text-gray-700">
                {currentSavedJob?.additional_info || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <ApplicationProgress />

      {/* 2 main cols, left col - 2/3: for job description. Right  col-1/3: for notes, contacts, etcc*/}
      <div className="lg:grid grid-cols-5 gap-4 w-full">
        {/* left col */}
        <div className="col-span-3 space-y-4 mb-4 lg:mb-0">
          <JobDescription
            jobDescription={currentSavedJob?.job_description || ""}
          />
          <Task jobId={currentSavedJob?.id.toString() || ""} />
        </div>

        {/* right col */}
        <div className="col-span-2 space-y-4">
          <div className="p-6 bg-white border border-[#dbe9ff] w-full shadow-sm space-y-4">
            <Note />
            <Contact
              contacts={currentSavedJob?.contacts}
              jobId={currentSavedJob?.id}
            />
            <AttachedDocuments documents={currentSavedJob?.documents || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
