import React from "react";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ArrowDownToLine,
  FileEdit,
  MoreHorizontal,
  Paperclip,
  Trash,
  Unlink,
} from "lucide-react";

import axios from "@/lib/axiosConfig";

import { useModal } from "@/stores/useModal";
import { useCurrentSavedJob } from "@/stores/useCurrentSavedJob";
import DocumentTypeTag from "./DocumentTypeTag";

interface AttachedDocumentItemProps {
  id: string;
  documentName: string;
  documentType: string;
  documentUrl: string;
}

const AttachedDocumentItemNew = ({
  id,
  documentName,
  documentType,
  documentUrl,
}: AttachedDocumentItemProps) => {
  const { onOpen } = useModal();
  const { currentSavedJob, setCurrentSavedJob } = useCurrentSavedJob();

  const removeDocumentFromJob = async (documentId: string) => {
    try {
      const res = await axios.put(`/documents/${documentId}/unlink-job`);

      if (currentSavedJob) {
        const updatedJob = {
          ...currentSavedJob,
          documents: currentSavedJob.documents.filter(
            (document) => document.id.toString() !== documentId
          ),
        };
        setCurrentSavedJob(updatedJob);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="group relative flex flex-col my-2 sm:my-0 rounded-md border py-3 border-[#e4eefd] shadow bg-white">
      <div className="flex items-center space-x-1 mb-1 px-3">
        {/* <p className="text-lg text-gray-700 font-semibold">{documentName}</p> */}
        <DocumentTypeTag documentType={documentType} />
      </div>
      <hr className="border-[#d5e4fc] my-2" />
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center space-x-2">
          <Paperclip size={16} className="text-blue-600" />
          <p className="font-semibold">{documentName}</p>
        </div>
        <Button
          size={"sm"}
          className="flex items-center"
          variant="outlinePrimary"
          onClick={() => window.open(documentUrl, "_blank")}
        >
          <ArrowDownToLine size={16} className="mr-1" />
          Download
        </Button>
      </div>
      <hr className="border-[#d5e4fc] my-2" />
      <div className="flex items-center space-x-1 px-3 py-1">
        <p className="text-sm text-gray-500">
          Uploaded on 04/08/2024. Attached to 3 job(s).
        </p>
      </div>

      <div className="absolute top-2 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-md border-none focus:outline-none hover:text-zinc-600">
              <MoreHorizontal size={20} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="left">
            <DropdownMenuItem
              className="flex items-center cursor-pointer"
              onClick={() => {}}
            >
              <Unlink size={18} className="mr-2 text-rose-500" />
              Unlink document
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default AttachedDocumentItemNew;
