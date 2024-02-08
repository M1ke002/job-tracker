import React from "react";

import { Contact, ListTodo, Paperclip, X } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

import SavedJob from "@/types/SavedJob";

interface ApplicationStageBoxItemProps {
  isLoading: boolean;
  job: SavedJob;
  removeJobFromStages: (jobId: number) => void;
}

const ApplicationStageBoxItem = ({
  isLoading,
  job,
  removeJobFromStages,
}: ApplicationStageBoxItemProps) => {
  const navigate = useNavigate();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `job-${job.id}`,
    data: {
      ...job,
      id: `job-${job.id}`,
      type: "job",
    },
    disabled: isLoading,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    // hover border blue
    <div
      style={style}
      {...attributes}
      ref={setNodeRef}
      {...listeners}
      className={cn(
        "flex flex-col relative group bg-white border-[1px] border-[#dce6f8] rounded-md p-3 mb-2 drop-shadow-sm hover:border-blue-400 hover:bg-[#f0f7fd] cursor-pointer",
        isDragging && "border-blue-500"
      )}
      onClick={() => navigate(`/saved-jobs/${job.id}`)}
    >
      <p className="font-semibold">{job.job_title}</p>
      <p className="text-sm">{job.company_name}</p>
      <p className="flex items-center mt-1 text-zinc-700">
        {job.contacts.length > 0 && <Contact size={13} className="mr-1" />}
        {job.tasks.length > 0 && <ListTodo size={13} />}
        {job.documents.length > 0 && <Paperclip size={13} />}
      </p>
      <button
        className="border-none focus:outline-none"
        onClick={(e) => {
          e.stopPropagation();
          removeJobFromStages(job.id);
        }}
      >
        <X
          size={20}
          className="hidden group-hover:block absolute top-2 right-2 hover:text-red-500"
          style={{ opacity: 0.5 }}
        />
      </button>
    </div>
  );
};

export default ApplicationStageBoxItem;
