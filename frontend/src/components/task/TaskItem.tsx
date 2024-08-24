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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const { id: currentSavedJobId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { onOpen } = useModal();

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

  const deleteTaskMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const res = await axios.delete(`/tasks/${task.id}`);
      return res.data;
    },
    onSuccess: async (_, jobId) => {
      await queryClient.invalidateQueries({
        queryKey: ["job-details", jobId],
      });

      //update application-stages as well???
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const completeTaskMutation = useMutation({
    mutationFn: async ({
      jobId,
      isCompleted,
    }: {
      jobId: string;
      isCompleted: boolean;
    }) => {
      const res = await axios.put(`/tasks/${task.id}/complete`, {
        isCompleted,
      });
      return res.data;
    },
    onSuccess: async (_, { jobId }) => {
      await queryClient.invalidateQueries({
        queryKey: ["job-details", jobId],
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const toggleTaskReminderMutation = useMutation({
    mutationFn: async ({
      jobId,
      isReminderEnabled,
    }: {
      jobId: string;
      isReminderEnabled: boolean;
    }) => {
      const res = await axios.put(`/tasks/${task.id}/reminder`, {
        isReminderEnabled,
      });
      return res.data;
    },
    onSuccess: async (_, { jobId }) => {
      //update current saved job
      //TODO: refetch data?

      await queryClient.invalidateQueries({
        queryKey: ["job-details", jobId],
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const deleteTask = async () => {
    if (!currentSavedJobId) return;
    deleteTaskMutation.mutate(currentSavedJobId);
  };

  const toggleTaskCompleted = async (isCompleted: boolean) => {
    if (!currentSavedJobId) return;
    completeTaskMutation.mutate({ jobId: currentSavedJobId, isCompleted });
  };

  const toggleReminder = async (isReminderEnabled: boolean) => {
    if (!currentSavedJobId) return;
    toggleTaskReminderMutation.mutate({
      jobId: currentSavedJobId,
      isReminderEnabled,
    });
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
