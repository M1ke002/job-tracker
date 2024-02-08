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

import { useSavedJobs } from "@/stores/useSavedJobs";
import { useModal } from "@/stores/useModal";

const AddJobToStageModal = () => {
  const { savedJobs, setSavedJobs } = useSavedJobs();
  const [filteredJobs, setFilteredJobs] = useState<SavedJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null); //
  const { type, isOpen, onClose, data } = useModal();
  const { stageId, setApplicationStageColumns } = data;
  const isModalOpen = isOpen && type === "addJobToStage";

  useEffect(() => {
    if (savedJobs.length > 0) {
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
      const updatedSavedJobs = savedJobs.map((job) => {
        if (job.id === updatedJob.id) {
          return updatedJob;
        }
        return job;
      });
      setSavedJobs(updatedSavedJobs);
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
