import React, { useEffect, useState } from "react";

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

import { useModal } from "@/stores/useModal";
import { useDocumentList } from "@/stores/useDocumentList";
import { useQueryClient } from "@tanstack/react-query";
import {
  refetchApplicationStagesData,
  refetchSavedJobsData,
} from "@/utils/refetch";

const LinkDocumentModal = () => {
  const { documentLists, setDocumentLists } = useDocumentList();
  const [filteredDocumentLists, setFilteredDocumentLists] = useState<
    DocumentType[]
  >([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null
  );
  const { type, isOpen, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "linkDocument";
  const { job } = data;

  useEffect(() => {
    if (documentLists.length > 0 && job) {
      //filter out the documents that are already linked to this job
      const filtered = documentLists.map((documentList) => {
        const filteredDocumentList = { ...documentList };

        filteredDocumentList.documents = documentList.documents.filter(
          (document) => document.job_id !== job.id
        );
        return filteredDocumentList;
      });
      setFilteredDocumentLists(filtered);
    } else {
      setFilteredDocumentLists([]);
    }
  }, [documentLists, job]);

  const linkDocument = async (documentId: string) => {
    try {
    } catch (error) {
      console.log(error);
    } finally {
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setSelectedDocumentId(null);
    onClose();
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
              onClick={() => {
                if (selectedDocumentId) {
                  linkDocument(selectedDocumentId);
                }
              }}
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
