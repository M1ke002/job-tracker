import React from "react";

import { FileEdit, MoreHorizontal, Plus, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "@/lib/utils";
import { applicationStageColors } from "@/constant/applicationStage";
import JobCard from "./JobCard";

import ApplicationStage from "@/types/ApplicationStage";
import SavedJob from "@/types/SavedJob";

import { useModal } from "@/stores/useModal";

type ApplicationStageName = keyof typeof applicationStageColors;

interface ApplicationStageColumnProps {
  id: number;
  stage_name: ApplicationStageName;
  jobs: SavedJob[];
  isLoading: boolean;
  removeJobFromStages: (jobId: number) => void;
  setApplicationStageColumns?: React.Dispatch<
    React.SetStateAction<ApplicationStage[]>
  >;
}

const ApplicationStageColumn = ({
  id,
  stage_name,
  jobs,
  isLoading,
  removeJobFromStages,
  setApplicationStageColumns,
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
      stage_name,
      jobs,
    },
    disabled: isLoading,
  });

  const { onOpen } = useModal();

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  //#f1f2f4
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("px-2 h-full", isLoading && "opacity-70")}
    >
      {/* #ebf4ff instead of #fff???? */}
      <div
        className={cn(
          "flex flex-col p-3 w-[340px] rounded-lg bg-[#fff] shadow-md border-[1px] border-[#c3dafe]",
          `border-${applicationStageColors[stage_name]}`
        )}
      >
        <div
          {...listeners}
          {...attributes}
          ref={setActivatorNodeRef}
          className="flex items-center justify-between touch-none"
        >
          <span className="font-medium">
            {stage_name}
            <div className="bg-[#c0dbf7] rounded-full text-center px-2 py-1 text-xs font-semibold ml-2 inline-block">
              {jobs.length}
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

        <hr className="my-2 border-[#d6eaff]" />

        <SortableContext
          items={jobs.map((job) => `job-${job.id}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="max-h-[360px] overflow-y-auto">
            {jobs.length === 0 && (
              <div className="flex items-center justify-center h-[100px] mb-2 font-semibold rounded-md border border-dashed border-[#c3dafe]">
                <p className=" text-gray-500">Drag job here</p>
              </div>
            )}
            {jobs.map((job, index) => {
              // console.log(job);
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  removeJobFromStages={removeJobFromStages}
                  isLoading={isLoading}
                />
              );
            })}
          </div>
        </SortableContext>

        <hr className="my-2 border-[#d6eaff]" />

        <button
          className="flex items-center hover:bg-[#f0f7fd] p-1 rounded-md"
          onClick={() => {
            onOpen("addJobToStage", {
              stageId: id.toString(),
              setApplicationStageColumns: setApplicationStageColumns,
            });
          }}
        >
          <Plus size={20} className="mr-1" />
          Add job
        </button>
      </div>
    </div>
  );
};

export default ApplicationStageColumn;
