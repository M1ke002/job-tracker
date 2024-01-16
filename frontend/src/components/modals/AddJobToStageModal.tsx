import React from "react";

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
import { useModal } from "@/hooks/zustand/useModal";
import axios from "@/lib/axiosConfig";

import { useSavedJobs } from "@/hooks/zustand/useSavedJobs";

const AddJobToStageModal = () => {
  const { savedJobs, setSavedJobs } = useSavedJobs();
  const { type, isOpen, onClose, data } = useModal();

  const isModalOpen = isOpen && type === "addJobToStage";

  const handleCloseModal = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-6 pb-2 px-6">
          <DialogTitle className="text-2xl text-center font-bold capitalize mb-5">
            Add job to stage
          </DialogTitle>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={"Select a job"} />
            </SelectTrigger>
            <SelectContent>
              {savedJobs.map((job) => (
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
