import React from "react";
import { Button } from "../ui/button";
import { ArrowDownToLine, Paperclip, Trash } from "lucide-react";

import axios from "@/lib/axiosConfig";

import { useModal } from "@/stores/useModal";
import { useCurrentSavedJob } from "@/stores/useCurrentSavedJob";

interface AttachedDocumentItemProps {
  id: string;
  documentName: string;
  documentType: string;
  documentUrl: string;
}

const AttachedDocumentItem = ({
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
    <div className="flex items-center justify-between mt-4 p-3 rounded-md border border-[#e4eefd] shadow">
      <div className="flex items-center space-x-2 truncate">
        <Paperclip size={16} className="text-blue-600" />
        <p>{documentName}</p>
      </div>
      <div className="flex items-center space-x-3">
        <Button
          size="sm"
          className="flex items-center text-sm"
          variant="outlinePrimary"
          onClick={() => window.open(documentUrl, "_blank")}
        >
          <ArrowDownToLine size={16} className="mr-1" />
          Download
        </Button>
        <button
          className="text-rose-500 focus:outline-none"
          onClick={() => {
            onOpen("removeDocument", {
              confirmModalTitle: "Remove document",
              confirmModalMessage:
                "Are you sure you want to remove this document from this job?",
              confirmModalConfirmButtonText: "Remove",
              confirmModalAction: () => removeDocumentFromJob(id),
            });
          }}
        >
          <Trash size={20} />
        </button>
      </div>
    </div>
  );
};

export default AttachedDocumentItem;
