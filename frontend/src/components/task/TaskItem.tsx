import React from "react";

import { FileEdit, MoreVertical, Trash } from "lucide-react";

import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { format } from "date-fns";
import { cn } from "@/lib/utils";
import axios from "@/lib/axiosConfig";
import Task from "@/types/Task";

import { useModal } from "@/stores/useModal";
import { useCurrentSavedJob } from "@/stores/useCurrentSavedJob";

interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const { onOpen } = useModal();
  const { currentSavedJob, setCurrentSavedJob } = useCurrentSavedJob();

  let type = "incomplete";
  let dueDate = null;
  if (task.due_date) {
    const today = new Date();
    dueDate = new Date(task.due_date);
    if (dueDate < today) {
      type = "overdue";
    }
  }
  if (task.is_completed) type = "completed";

  const deleteTask = async () => {
    try {
      const res = await axios.delete(`/tasks/${task.id}`);
      //update current saved job
      if (currentSavedJob) {
        const updatedTasks = currentSavedJob.tasks.filter(
          (currTask) => currTask.id !== task.id
        );
        setCurrentSavedJob({ ...currentSavedJob, tasks: updatedTasks });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleTaskCompleted = async (isCompleted: boolean) => {
    try {
      const res = await axios.put(`/tasks/${task.id}/complete`, {
        isCompleted,
      });
      //update current saved job
      if (currentSavedJob) {
        const updatedTasks = currentSavedJob.tasks.map((currTask) => {
          if (currTask.id === task.id) {
            return { ...currTask, is_completed: isCompleted };
          }
          return currTask;
        });
        setCurrentSavedJob({ ...currentSavedJob, tasks: updatedTasks });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleReminder = async (isReminderEnabled: boolean) => {
    try {
      const res = await axios.put(`/tasks/${task.id}/reminder`, {
        isReminderEnabled,
      });
      //update current saved job
      if (currentSavedJob) {
        const updatedTasks = currentSavedJob.tasks.map((currTask) => {
          if (currTask.id === task.id) {
            return { ...currTask, is_reminder_enabled: isReminderEnabled };
          }
          return currTask;
        });
        setCurrentSavedJob({ ...currentSavedJob, tasks: updatedTasks });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col my-3 p-3 border rounded-sm shadow space-y-2 border-[#e4eefd] bg-white"
      )}
    >
      <div className="flex items-center space-x-1">
        <h3
          className={cn(
            "text-gray-700 font-semibold",
            type === "completed" && "line-through text-gray-400"
          )}
        >
          {task.task_name}
        </h3>
        <span className="text-gray-500">-</span>
        <span
          className={cn("text-gray-500", type === "overdue" && "text-rose-500")}
        >
          Due: {dueDate ? format(new Date(dueDate), "MMM dd, yyyy") : "N/A"}
        </span>
      </div>
      <div className="flex items-center space-x-5">
        <Button
          size="sm"
          variant="outlinePrimary"
          className={cn(
            type === "completed" &&
              "border-blue-500 bg-blue-500 hover:bg-blue-500/80 text-white"
          )}
          onClick={() => toggleTaskCompleted(!task.is_completed)}
        >
          {type === "completed" ? "Completed" : "Mark as done"}
        </Button>
        <div className="flex items-center space-x-2">
          <Switch
            className="data-[state=checked]:bg-blue-500"
            checked={task.is_reminder_enabled}
            onCheckedChange={(checked) => toggleReminder(checked)}
          />
          <span className="text-sm">Remind me</span>
        </div>
      </div>
      <div className="absolute top-2 right-2 flex items-center space-x-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-md border-none focus:outline-none hover:text-zinc-600">
              <MoreVertical size={20} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right">
            <DropdownMenuItem
              className="flex items-center cursor-pointer"
              onClick={() => onOpen("editTask", { task })}
            >
              <FileEdit size={18} className="mr-2 text-blue-500" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center cursor-pointer"
              onClick={() => {
                onOpen("deleteTask", {
                  confirmModalTitle: "Delete Task",
                  confirmModalMessage:
                    "Are you sure you want to delete this task?",
                  confirmModalConfirmButtonText: "Delete",
                  confirmModalAction: deleteTask,
                });
              }}
            >
              <Trash size={18} className="mr-2 text-rose-500" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TaskItem;
