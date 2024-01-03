import { FileEdit, MoreVertical, Trash } from "lucide-react";
import React from "react";
import { Checkbox } from "../ui/checkbox";
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
import { cn } from "@/lib/utils";

import { useModal } from "@/hooks/zustand/useModal";

interface TaskItemProps {
  type: "completed" | "incomplete" | "overdue";
}

const TaskItem = ({ type }: TaskItemProps) => {
  const { onOpen } = useModal();
  return (
    <div
      className={cn(
        "relative flex flex-col my-3 p-3 border rounded-sm shadow-sm space-y-2",
        type === "completed" && "border-[#c3dafe]",
        type === "incomplete" && "border-[#c3dafe]",
        type === "overdue" && "border-[#f87171]"
      )}
    >
      <div className="flex items-center space-x-1">
        <h3 className=" text-gray-700 font-semibold">Do mock interview</h3>
        <span className="text-gray-500">-</span>
        <span className="text-gray-500">Due: 29/12/2023</span>
      </div>
      <div className="flex items-center space-x-5">
        <Button
          size="sm"
          variant="outlinePrimary"
          className={cn(
            type === "completed" &&
              " border-green-500 hover:bg-green-500 hover:text-white"
          )}
        >
          {type === "completed" ? "Completed" : "Mark as completed"}
        </Button>
        <div className="flex items-center space-x-2">
          <Switch className="data-[state=checked]:bg-blue-500" />
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
            <DropdownMenuItem className="flex items-center cursor-pointer">
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
                  confirmModalAction: () => {
                    console.log("delete task");
                  },
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
