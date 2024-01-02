import { Contact, ListTodo, X } from "lucide-react";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface ApplicationStageBoxItemProps {
  id: number;
  title: string;
  company: string;
}

const ApplicationStageBoxItem = ({
  id,
  title,
  company,
}: ApplicationStageBoxItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `job-${id}`,
    data: {
      id: `job-${id}`,
      type: "job",
      title,
      company,
    },
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
    >
      <p className="font-semibold">{title}</p>
      <p className="text-sm">{company}</p>
      <p className="flex items-center mt-1 text-zinc-700">
        <Contact size={13} className="mr-1" />
        <ListTodo size={13} />
      </p>
      <X
        size={20}
        className="hidden group-hover:block absolute top-2 right-2 hover:text-red-500"
        style={{ opacity: 0.5 }}
      />
    </div>
  );
};

export default ApplicationStageBoxItem;
