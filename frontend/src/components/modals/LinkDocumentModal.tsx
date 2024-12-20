import React, { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Button } from "../ui/button";

import axios from "@/lib/axiosConfig";
import DocumentType from "@/types/DocumentType";
import SavedJob from "@/types/SavedJob";

import { useModal } from "@/stores/useModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const LinkDocumentModal = () => {
  const { type, isOpen, onClose, data } = useModal();
  const queryClient = useQueryClient();
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null
  );

  const isModalOpen = isOpen && type === "linkDocument";
  const { documentLists, currentSavedJob } = data;

  const filteredDocumentLists = useMemo(() => {
    if (documentLists && documentLists.length > 0 && currentSavedJob) {
      //filter out the documents that are already linked to this job
      return documentLists.map((documentList) => {
        const filteredDocumentList = { ...documentList };
        filteredDocumentList.documents = documentList.documents.filter(
          (document) =>
            !document.jobs.some(
              (attachedJob) => attachedJob.id === currentSavedJob.id
            )
        );
        return filteredDocumentList;
      });
    }
    return [];
  }, [documentLists, currentSavedJob]);

  const linkDocumentMutation = useMutation({
    mutationFn: async ({
      currSavedJob,
      documentId,
    }: {
      currSavedJob: SavedJob;
      documentId: string;
    }) => {
      const res = await axios.put(
        `/saved-jobs/${currSavedJob.id}/link-document`,
        {
          documentId,
        }
      );
      return res.data;
    },
    onSuccess: async (_, { currSavedJob, documentId }) => {
      //update currentSavedJob
      await queryClient.invalidateQueries({
        queryKey: ["job-details", currSavedJob.id.toString()],
      });

      //update application stages (necessary???)
      queryClient.invalidateQueries({
        queryKey: ["application-stages"],
      });

      // update documentLists cache with new linked job
      queryClient.setQueryData<DocumentType[] | undefined>(
        ["document-lists"],
        (oldData) => {
          if (!oldData) return oldData;

          return oldData.map((documentList) => ({
            ...documentList,
            documents: documentList.documents.map((document) => {
              if (document.id.toString() === documentId) {
                const updatedDocument = { ...document };
                updatedDocument.jobs.push({
                  id: currSavedJob.id,
                  job_title: currSavedJob.job_title,
                });
                return updatedDocument;
              }
              return document;
            }),
          }));
        }
      );
    },
    onSettled: () => {
      handleCloseModal();
    },
  });

  const handleCloseModal = () => {
    setSelectedDocumentId(null);
    onClose();
  };

  const handleLinkDocument = () => {
    if (!currentSavedJob || !selectedDocumentId) return;
    linkDocumentMutation.mutate({
      currSavedJob: currentSavedJob,
      documentId: selectedDocumentId,
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-6 pb-2 px-6">
          <DialogTitle className="text-2xl text-center font-bold capitalize mb-5">
            Link Document
          </DialogTitle>
          <Select onValueChange={(value) => setSelectedDocumentId(value)}>
            <SelectTrigger>
              <SelectValue placeholder={"Select a document"} />
            </SelectTrigger>
            <SelectContent>
              {filteredDocumentLists.length === 0 && (
                <SelectItem value="None" disabled>
                  No documents available
                </SelectItem>
              )}
              {filteredDocumentLists.map((documentList) => (
                <SelectGroup key={documentList.id}>
                  <SelectLabel>{documentList.type_name}</SelectLabel>
                  {documentList.documents.map((document) => (
                    <SelectItem
                      value={document.id.toString()}
                      key={document.id}
                    >
                      {document.file_name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center ml-auto">
            <Button
              variant="ghost"
              className="mr-2 hover:text-zinc-500"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="text-white bg-blue-500 hover:bg-blue-600"
              onClick={handleLinkDocument}
            >
              Link
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LinkDocumentModal;
