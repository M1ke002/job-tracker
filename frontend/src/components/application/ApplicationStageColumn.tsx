import React from "react";
import { Separator } from "../ui/separator";
import { MoreHorizontal, Plus } from "lucide-react";
import JobCard from "./JobCard";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ApplicationStageColumnProps {
  id: number;
  name: string;
  jobOrderIds: number[];
  jobs: {
    id: number;
    title: string;
    company: string;
    stageId: number;
    isPlaceholder?: boolean;
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

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  //#f1f2f4
  return (
    <div ref={setNodeRef} style={style} className="px-3 h-full">
      {/* #ebf4ff instead of #fff???? */}
      <div className="flex flex-col p-3 w-[340px] rounded-lg bg-[#fff] shadow-md border-[1px] border-[#c3dafe]">
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
          <MoreHorizontal size={20} />
        </div>

        <Separator className="my-2 bg-[#d6eaff]" />

        <SortableContext
          // items={jobs.map((job) => `job-${job.id}`) || [`placeholder-${id}`]}
          items={jobs.map((job) => {
            if (job.isPlaceholder) {
              return `placeholderJob-${job.id}`;
            } else {
              return `job-${job.id}`;
            }
          })}
          strategy={verticalListSortingStrategy}
        >
          <div className="max-h-[360px] overflow-y-auto">
            {/* if empty jobs arr -> render placeholder card */}
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
