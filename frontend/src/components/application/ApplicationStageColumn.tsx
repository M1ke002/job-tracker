import React from "react";
import { Separator } from "../ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileEdit, MoreHorizontal, Plus, Trash } from "lucide-react";
import JobCard from "./JobCard";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

import { useModal } from "@/hooks/zustand/useModal";

interface ApplicationStageColumnProps {
  id: number;
  name: string;
  jobOrderIds: number[];
  jobs: {
    id: number;
    title: string;
    company: string;
    stageId: number;
  }[];
}

const ApplicationStageColumn = ({
  id,
  name,
  jobs,
}: ApplicationStageColumnProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `stage-${id}`,
    data: {
      id: `stage-${id}`,
      type: "applicationStage",
      name,
      jobs,
    },
  });

  const { onOpen } = useModal();

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  //#f1f2f4
  return (
    <div ref={setNodeRef} style={style} className="px-3 h-full">
      {/* #ebf4ff instead of #fff???? */}
      <div
        className={cn(
          "flex flex-col p-3 w-[340px] rounded-lg bg-[#fff] shadow-md border-[1px] border-[#c3dafe]",
          isDragging && "border-blue-500",
          name === "Applied" && "border-[#c3dafe]",
          name === "Interview" && "border-yellow-300",
          name === "Offer" && "border-green-300",
          name === "Rejected" && "border-rose-300"
        )}
      >
        <div
          {...listeners}
          {...attributes}
          ref={setActivatorNodeRef}
          className="flex items-center justify-between touch-none"
        >
          <span className="font-medium">
            {name}
            <div className="bg-[#c0dbf7] rounded-full text-center px-2 py-1 text-xs font-semibold ml-2 inline-block">
              2
            </div>
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-md border-none focus:outline-none hover:text-zinc-600">
                <MoreHorizontal size={20} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="flex items-center cursor-pointer">
                <FileEdit size={18} className="mr-2 text-blue-500" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center cursor-pointer"
                onClick={() => {
                  onOpen("deleteApplicationStage", {
                    confirmModalTitle: "Delete stage",
                    confirmModalMessage:
                      "Are you sure you want to delete this stage?",
                    confirmModalConfirmButtonText: "Delete",
                    confirmModalAction: () => {
                      console.log("delete stage");
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

        <Separator className="my-2 bg-[#d6eaff]" />

        <SortableContext
          items={jobs.map((job) => `job-${job.id}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="max-h-[360px] overflow-y-auto">
            {jobs.map((job, index) => (
              <JobCard
                key={job.id}
                id={job.id}
                title={job.title}
                company={job.company}
              />
            ))}
          </div>
        </SortableContext>

        <Separator className="my-2 bg-[#d6eaff]" />

        {/* was #ddecfc instead of #f0f7fd??? */}
        <button className="flex items-center hover:bg-[#f0f7fd] p-1 rounded-md">
          <Plus size={20} className="mr-1" />
          Add Item
        </button>
      </div>
    </div>
  );
};

export default ApplicationStageColumn;
