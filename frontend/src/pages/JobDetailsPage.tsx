import React, { useEffect, useState } from "react";

import {
  Briefcase,
  ChevronDownCircle,
  CircleDollarSign,
  FileEdit,
  FolderClosedIcon,
  Info,
  InfoIcon,
  ListChecksIcon,
  MapPin,
  Trash,
  User,
  WrenchIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ApplicationProgress from "@/components/application/ApplicationProgress";
import AttachedDocuments from "@/components/document/AttachedDocuments";
import Note from "@/components/note/Note";
import Contact from "@/components/contact/Contact";
import Task from "@/components/task/Task";
import JobDescription from "@/components/jobs/JobDescription";
import axios from "@/lib/axiosConfig";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  refetchApplicationStagesData,
  refetchSavedJobsData,
  refetchJobDetailsData,
} from "@/utils/refetch";

import { useParams, useNavigate } from "react-router-dom";
import { useModal } from "@/stores/useModal";
import { useCurrentSavedJob } from "@/stores/useCurrentSavedJob";
import { useApplicationStages } from "@/stores/useApplicationStages";
import { ApplicationStageNames } from "@/utils/constants";
import { useJobDetailsQuery } from "@/hooks/queries/useJobDetailsQuery";
import { useApplicationStagesQuery } from "@/hooks/queries/useApplicationStagesQuery";
import OverviewTab from "@/components/tabs/OverviewTab";
import TasksTab from "@/components/tabs/TasksTab";
import ContactsTab from "@/components/tabs/ContactsTab";
import DocumentsTab from "@/components/tabs/DocumentsTab";

const JobDetailsPage = () => {
  const { applicationStages, setApplicationStages } = useApplicationStages();
  const { currentSavedJob, setCurrentSavedJob } = useCurrentSavedJob();
  const [isLoading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { onOpen } = useModal();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: jobDetailsData, status: jobDetailsStatus } =
    useJobDetailsQuery(id);
  const { data: applicationStagesData, status: applicationStagesStatus } =
    useApplicationStagesQuery();

  useEffect(() => {
    if (jobDetailsData) {
      setCurrentSavedJob(jobDetailsData);
    }

    return () => {
      setCurrentSavedJob(null);
    };
  }, [jobDetailsData]);

  useEffect(() => {
    if (applicationStagesData) {
      setApplicationStages(applicationStagesData);
    }
  }, [applicationStagesData]);

  const changeJobStage = async (stageId: string) => {
    try {
      setLoading(true);
      const res = await axios.put(`/saved-jobs/${id}/stage`, {
        stageId: stageId,
      });
      setLoading(false);
      setCurrentSavedJob(res.data);

      // await refetchApplicationStagesData(queryClient);
      // await refetchSavedJobsData(queryClient);
      // await refetchJobDetailsData(queryClient, id!);
      // refetchJobDetails();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteJob = async () => {
    try {
      const res = await axios.delete(`/saved-jobs/${id}`);
      setCurrentSavedJob(null);
      navigate("/saved-jobs");

      // await refetchApplicationStagesData(queryClient);
      // await refetchSavedJobsData(queryClient);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-auto my-4 px-4 flex flex-col items-center max-w-[1450px] space-y-4">
      {/* header (company name, job details) */}
      <div className="flex flex-col p-6 bg-white border border-[#dbe9ff] w-full shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-end space-x-3 w-full">
            {jobDetailsStatus === "pending" ? (
              <Skeleton className="w-[60%] h-9 bg-zinc-300" />
            ) : (
              <h2 className="text-3xl font-semibold">
                {currentSavedJob?.job_title}
              </h2>
            )}
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
                currentSavedJob?.stage?.stage_name ===
                  ApplicationStageNames.OA && "border-[#a3e8f8]",
                currentSavedJob?.stage?.stage_name ===
                  ApplicationStageNames.INTERVIEWING && "border-amber-200",
                currentSavedJob?.stage?.stage_name ===
                  ApplicationStageNames.OFFER && "border-green-300",
                currentSavedJob?.stage?.stage_name ===
                  ApplicationStageNames.REJECTED && "border-rose-300"
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
            {jobDetailsStatus === "pending" ? (
              <Skeleton className="w-20 h-6 bg-zinc-200 mt-1 mb-1" />
            ) : (
              <h3 className="text-lg text-gray-700 font-semibold">
                {currentSavedJob?.company_name}
              </h3>
            )}
            <span className="text-gray-700">—</span>
            <span className="text-gray-700">
              {jobDetailsStatus === "pending" ? (
                <Skeleton className="w-16 h-6 bg-zinc-200 mt-1 mb-1" />
              ) : (
                currentSavedJob?.location
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center flex-wrap space-x-6">
            <div>
              {/* <span className="text-gray-700 mr-1">View job posting</span> */}
              {jobDetailsStatus === "pending" ? (
                <Skeleton className="w-28 h-6 bg-zinc-100" />
              ) : (
                <a
                  href={currentSavedJob?.job_url}
                  target="_blank"
                  className="text-blue-700 underline hover:text-blue-700/80"
                >
                  View job posting
                </a>
              )}
            </div>

            <div className="flex items-center">
              <MapPin className="mr-2 text-blue-700" size={18} />
              <span className="text-gray-700">
                {jobDetailsStatus === "pending" ? (
                  <Skeleton className="w-20 h-6 bg-zinc-100" />
                ) : (
                  currentSavedJob?.location || "N/A"
                )}
              </span>
            </div>

            <div className="flex items-center">
              <CircleDollarSign className="mr-2 text-blue-700" size={18} />
              <span className="text-gray-700">
                {jobDetailsStatus === "pending" ? (
                  <Skeleton className="w-20 h-6 bg-zinc-100" />
                ) : (
                  currentSavedJob?.salary || "N/A"
                )}
              </span>
            </div>

            <div className="flex items-center">
              <Briefcase className="mr-2 text-blue-700" size={18} />
              <span className="text-gray-700">
                {jobDetailsStatus === "pending" ? (
                  <Skeleton className="w-20 h-6 bg-zinc-100" />
                ) : (
                  currentSavedJob?.additional_info || "N/A"
                )}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span
                className={cn("flex h-2 w-2 rounded-full mt-[1px] bg-blue-600")}
              />
              <span className="text-gray-700">
                {jobDetailsStatus === "pending" ? (
                  <Skeleton className="w-24 h-6 bg-zinc-100" />
                ) : (
                  currentSavedJob?.created_at &&
                  `Saved on: ${format(
                    new Date(currentSavedJob?.created_at),
                    "dd/MM/yyyy"
                  )}`
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <ApplicationProgress
        isLoading={
          applicationStagesStatus === "pending" ||
          jobDetailsStatus === "pending"
        }
      />

      <Tabs defaultValue="overview" className="w-full space-y-4 pt-4">
        <TabsList className="w-full h-full flex items-center justify-between bg-transparent space-x-3 rounded-none p-0 overflow-x-auto">
          <TabsTrigger
            className="space-x-1 p-3 rounded-none w-full bg-white border border-[#dbe9ff] shadow-sm data-[state=active]:border-blue-400 data-[state=active]:bg-[#e4eff8] hover:border-blue-400 hover:bg-[#e4eff8]"
            value="overview"
          >
            <InfoIcon size={16} className="mr-1" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            className="space-x-1 p-3 rounded-none w-full bg-white border border-[#dbe9ff] shadow-sm data-[state=active]:border-blue-400 data-[state=active]:bg-[#e4eff8] hover:border-blue-400 hover:bg-[#e4eff8]"
            value="tasks"
          >
            <ListChecksIcon size={16} className="mr-1" />
            Tasks
          </TabsTrigger>
          <TabsTrigger
            className="space-x-1 p-3 rounded-none w-full bg-white border border-[#dbe9ff] shadow-sm data-[state=active]:border-blue-400 data-[state=active]:bg-[#e4eff8] hover:border-blue-400 hover:bg-[#e4eff8]"
            value="contacts"
          >
            <User size={16} className="mr-1" />
            Contacts
          </TabsTrigger>
          <TabsTrigger
            className="space-x-1 p-3 rounded-none w-full bg-white border border-[#dbe9ff] shadow-sm data-[state=active]:border-blue-400 data-[state=active]:bg-[#e4eff8] hover:border-blue-400 hover:bg-[#e4eff8]"
            value="documents"
          >
            <FolderClosedIcon size={16} className="mr-1" />
            Documents
          </TabsTrigger>
          <TabsTrigger
            className="space-x-1 p-3 rounded-none w-full bg-white border border-[#dbe9ff] shadow-sm data-[state=active]:border-blue-400 data-[state=active]:bg-[#e4eff8] hover:border-blue-400 hover:bg-[#e4eff8]"
            value="tools"
          >
            <WrenchIcon size={16} className="mr-1" />
            Tools
          </TabsTrigger>
        </TabsList>

        <div>
          <TabsContent value="overview">
            <OverviewTab
              currentSavedJob={currentSavedJob}
              jobDetailsStatus={jobDetailsStatus}
            />
          </TabsContent>
          <TabsContent value="tasks">
            <TasksTab />
          </TabsContent>
          <TabsContent value="contacts">
            <ContactsTab />
          </TabsContent>
          <TabsContent value="documents">
            <DocumentsTab />
          </TabsContent>
          <TabsContent value="tools">Nothing yet.</TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default JobDetailsPage;
