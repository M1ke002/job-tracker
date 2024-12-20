import React from "react";

import { FolderClosedIcon, FolderSearch, Link, PlusCircle } from "lucide-react";

import { Button } from "../ui/button";

import AttachedDocumentItem from "../document/AttachedDocumentItem";

import { useParams } from "react-router-dom";
import { useJobDetailsQuery } from "@/hooks/queries/useJobDetailsQuery";
import { useDocumentsQuery } from "@/hooks/queries/useDocumentsQuery";
import { useModal } from "@/stores/useModal";

const DocumentsTab = () => {
  const { id: currentSavedJobId } = useParams<{ id: string }>();
  const { data: currentSavedJob } = useJobDetailsQuery(currentSavedJobId);
  const { data: documentLists, status: documentListsStatus } =
    useDocumentsQuery();
  const { onOpen } = useModal();

  const documents = currentSavedJob?.documents || [];

  return (
    <div>
      <div className="font-semibold flex items-center justify-between">
        <p className="text-lg">Documents: {documents.length}</p>
        <div className="space-x-3">
          <Button
            variant="primary"
            onClick={() => {
              if (currentSavedJob) {
                onOpen("uploadDocument", { documentLists, currentSavedJob });
              }
            }}
          >
            <PlusCircle size={20} className="mr-2" />
            Add document
          </Button>
          <Button
            variant="outlinePrimary"
            className="text-[#3d3d3d] hover:text-[#3d3d3d] px-2 bg-white"
            onClick={() => {
              if (currentSavedJob) {
                onOpen("linkDocument", { documentLists, currentSavedJob });
              }
            }}
          >
            <Link size={20} className="mr-2" />
            Link document
          </Button>
        </div>
      </div>
      <hr className="mt-4 mb-5 border-[#d6eaff]" />

      {documents.length === 0 && (
        <div className="flex flex-col items-center justify-center space-y-3 min-h-[200px]">
          <FolderSearch size={50} className="text-gray-300" />
          <p className="text-lg text-gray-500">No documents attached</p>
        </div>
      )}

      {documents.length > 0 && (
        <div className="grid grid-cols-1 gap-1 lg:grid-cols-2 xl:grid-cols-3 sm:gap-4 w-full">
          {documents.map((document) => (
            <AttachedDocumentItem
              key={document.id}
              documentId={document.id.toString()}
              documentName={document.file_name}
              documentType={document.document_type_name}
              documentUrl={document.file_url}
              dateUploaded={document.date_uploaded}
              attachedJobs={document.jobs}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentsTab;
