import { MoreVertical } from "lucide-react";
import React from "react";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  type: "completed" | "incomplete" | "overdue";
}

const TaskItem = ({ type }: TaskItemProps) => {
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
          <Switch />
          <span className="text-sm">Remind me</span>
        </div>
      </div>
      <div className="absolute top-3 right-3 flex items-center space-x-1">
        <button className="border-none focus:outline-none ">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
