import React, { useEffect, useMemo, useState } from "react";

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

import { useModal } from "@/stores/useModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddJobToStageModal = () => {
  const { type, isOpen, onClose, data } = useModal();
  const queryClient = useQueryClient();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const { stageId, setApplicationStageColumns, savedJobs } = data;
  const isModalOpen = isOpen && type === "addJobToStage";

  const filteredJobs = useMemo(() => {
    if (savedJobs && savedJobs.length > 0) {
      return savedJobs.filter((job) => !job.stage);
    }
    return [];
  }, [savedJobs]);

  const addJobToStageMutation = useMutation({
    mutationFn: async ({
      jobId,
      stageId,
    }: {
      jobId: string;
      stageId: string;
    }) => {
      const res = await axios.put(`/saved-jobs/${jobId}/stage`, {
        stageId,
      });

      return res.data;
    },
    onSuccess: async (updatedJob: SavedJob, { stageId }) => {
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

      //update saved jobs, application-stages, job-details cache
      await queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["application-stages"] });
      queryClient.invalidateQueries({
        queryKey: ["job-details", updatedJob.id.toString()],
      });
    },
    onError: (error) => {
      console.error(error);
    },
    onSettled: () => {
      handleCloseModal();
    },
  });

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
              disabled={addJobToStageMutation.isPending}
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="text-white bg-blue-500 hover:bg-blue-600"
              disabled={addJobToStageMutation.isPending}
              onClick={() => {
                if (selectedJobId && stageId) {
                  addJobToStageMutation.mutate({
                    jobId: selectedJobId,
                    stageId,
                  });
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
