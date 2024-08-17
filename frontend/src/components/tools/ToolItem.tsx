import React from "react";

import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface ToolItemProps {
  toolName: string;
  toolDescription: string;
  buttonMessage: string;
  buttonTextColor: string;
}

const ToolItem = ({
  toolName,
  toolDescription,
  buttonMessage,
  buttonTextColor,
}: ToolItemProps) => {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-sm border p-4 min-h-[150px] cursor-pointer space-y-1 drop-shadow-sm hover:border-blue-400 hover:bg-[#f0f7fd]">
      <p className="font-semibold capitalize">{toolName}</p>
      <p className="text-gray-500 text-sm">{toolDescription}</p>
      <button
        className={cn(
          "flex items-center justify-center text-blue-500 font-semibold focus:outline-none w-[fit-content] !mt-auto pt-3",
          `text-[${buttonTextColor}]`
        )}
      >
        {buttonMessage}
        <ArrowRight size={18} className="ml-1 mt-1" />
      </button>
    </div>
  );
};

export default ToolItem;
