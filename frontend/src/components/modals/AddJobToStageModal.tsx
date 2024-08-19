import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";

import axios from "@/lib/axiosConfig";
import SavedJob from "@/types/SavedJob";

import { useSavedJobsQuery } from "@/hooks/queries/useSavedJobsQuery";
import { useModal } from "@/stores/useModal";
import { useQueryClient } from "@tanstack/react-query";

import {
  refetchApplicationStagesData,
  refetchSavedJobsData,
} from "@/utils/refetch";

const AddJobToStageModal = () => {
  const { data: savedJobs, status: savedJobsStatus } = useSavedJobsQuery();
  const [filteredJobs, setFilteredJobs] = useState<SavedJob[]>([]);
  const { type, isOpen, onClose, data } = useModal();
  const queryClient = useQueryClient();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const { stageId, setApplicationStageColumns } = data;
  const isModalOpen = isOpen && type === "addJobToStage";

  useEffect(() => {
    if (savedJobs && savedJobs.length > 0) {
      const filtered = savedJobs.filter((job) => !job.stage);
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs([]);
    }
  }, [savedJobs]);

  const addJobToStage = async (jobId: string, stageId: string) => {
    try {
      const res = await axios.put(`/saved-jobs/${jobId}/stage`, {
        stageId,
      });
      const updatedJob = res.data;

      //update application stage columns
      if (setApplicationStageColumns && stageId) {
        setApplicationStageColumns((prev) => {
          const updatedColumns = prev.map((stage) => {
            if (stage.id.toString() === stageId) {
              stage.jobs.push(updatedJob);
            }
            return stage;
          });
          return updatedColumns;
        });
      }

      //update saved jobs
      queryClient.setQueryData(
        ["saved-jobs"],
        (oldData: SavedJob[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map((job) =>
            job.id === updatedJob.id ? updatedJob : job
          );
        }
      );
    } catch (error) {
      console.log(error);
    } finally {
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setSelectedJobId(null);
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-6 pb-2 px-6">
          <DialogTitle className="text-2xl text-center font-bold capitalize mb-5">
            Add job to stage
          </DialogTitle>
          <Select onValueChange={(value) => setSelectedJobId(value)}>
            <SelectTrigger>
              <SelectValue placeholder={"Select a job"} />
            </SelectTrigger>
            <SelectContent>
              {filteredJobs.length === 0 && (
                <SelectItem value="None" disabled>
                  No jobs available
                </SelectItem>
              )}
              {filteredJobs.map((job) => (
                <SelectItem key={job.id} value={job.id.toString()}>
                  {job.job_title + " - " + job.company_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center ml-auto">
            <Button
              variant="ghost"
              className="mr-2 hover:text-zinc-500"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="text-white bg-blue-500 hover:bg-blue-600"
              onClick={() => {
                if (selectedJobId && stageId) {
                  addJobToStage(selectedJobId, stageId);
                }
              }}
            >
              Add
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddJobToStageModal;
