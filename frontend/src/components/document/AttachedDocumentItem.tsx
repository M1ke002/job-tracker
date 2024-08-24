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
import { sydneyToUTCTime } from "@/utils/utils";
import { format } from "date-fns";

import DocumentTypeTag from "./DocumentTypeTag";

import DocumentType from "@/types/DocumentType";

import { useModal } from "@/stores/useModal";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AttachedDocumentItemProps {
  documentId: string;
  documentName: string;
  documentType: string;
  documentUrl: string;
  dateUploaded: string;
  attachedJobs: {
    id: number;
    job_title: string;
  }[];
}

const AttachedDocumentItem = ({
  documentId,
  documentName,
  documentType,
  documentUrl,
  dateUploaded,
  attachedJobs,
}: AttachedDocumentItemProps) => {
  const { id: currentSavedJobId } = useParams<{ id: string }>();
  const { onOpen } = useModal();
  const queryClient = useQueryClient();

  //must - 10 hours to get the correct date
  const convertedDate = sydneyToUTCTime(new Date(dateUploaded));

  const unlinkDocumentMutation = useMutation({
    mutationFn: async ({
      jobId,
      documentId,
    }: {
      jobId: string;
      documentId: string;
    }) => {
      const res = await axios.put(`/saved-jobs/${jobId}/unlink-document`, {
        documentId,
      });

      return res.data;
    },
    onSuccess: async (_, { jobId }) => {
      //update currentSavedJob
      await queryClient.invalidateQueries({
        queryKey: ["job-details", jobId],
      });

      //update documentLists in cache
      queryClient.setQueryData<DocumentType[] | undefined>(
        ["document-lists"],
        (oldData) => {
          if (!oldData) return oldData;

          return oldData.map((documentList) => ({
            ...documentList,
            documents: documentList.documents.map((document) => {
              if (document.id.toString() === documentId) {
                return {
                  ...document,
                  jobs: document.jobs.filter(
                    (job) => job.id.toString() !== jobId
                  ),
                };
              } else {
                return document;
              }
            }),
          }));
        }
      );
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleUnlinkDocument = () => {
    if (!currentSavedJobId) return;
    unlinkDocumentMutation.mutate({ jobId: currentSavedJobId, documentId });
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
          Uploaded on {format(convertedDate, "dd/MM/yyyy")}. Attached to{" "}
          {attachedJobs.length} job(s).
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
              onClick={() => {
                onOpen("removeDocument", {
                  confirmModalTitle: "Remove document",
                  confirmModalMessage:
                    "Are you sure you want to remove this document from this job?",
                  confirmModalConfirmButtonText: "Remove",
                  confirmModalAction: handleUnlinkDocument,
                });
              }}
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

export default AttachedDocumentItem;
