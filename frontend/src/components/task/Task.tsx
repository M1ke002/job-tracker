import React, { useState } from "react";

import { ChevronDownCircle, PlusCircle } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

import TaskItem from "@/components/task/TaskItem";

import { useModal } from "@/stores/useModal";
import { useCurrentSavedJob } from "@/stores/useCurrentSavedJob";

interface TaskProps {
  jobId: string;
}

const Task = ({ jobId }: TaskProps) => {
  const { currentSavedJob, setCurrentSavedJob } = useCurrentSavedJob();
  const { onOpen } = useModal();
  const [rotateChevron, setRotateChevron] = useState(false);

  const handleRotate = () => setRotateChevron(!rotateChevron);
  const rotate = rotateChevron ? "rotate(-180deg)" : "rotate(0)";

  return (
    <Collapsible defaultOpen={true}>
      <div className="p-6 bg-white border border-[#dbe9ff] w-full shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold mb-2">Tasks</h2>
          <CollapsibleTrigger>
            <ChevronDownCircle
              className="text-blue-600 cursor-pointer transition"
              style={{ transform: rotate, transition: "all 0.2s linear" }}
              size={23}
              onClick={handleRotate}
            />
          </CollapsibleTrigger>
        </div>
        <hr className="my-2 border-[#d6eaff]" />
        <CollapsibleContent>
          {currentSavedJob?.tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
          {/* <TaskItem type="completed" />
          <TaskItem type="overdue" /> */}
          <Button
            variant="primary"
            className="mt-2 w-full"
            onClick={() => onOpen("createTask", { jobId })}
          >
            <PlusCircle size={20} className="mr-2" />
            Add a task
          </Button>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default Task;
