import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
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
} from "@/components/ui/select";
import { Button } from "../ui/button";

import axios from "@/lib/axiosConfig";

import DocumentType from "@/types/DocumentType";

import { useModal } from "@/stores/useModal";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  documentType: z.string(),
});

const EditDocumentModal = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { type, isOpen, onClose, data } = useModal();
  const queryClient = useQueryClient();

  const { documentId, documentType, documentLists } = data;
  const isModalOpen = isOpen && type === "editDocument";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentType: "",
    },
  });

  useEffect(() => {
    if (documentType) {
      form.setValue("documentType", documentType);
    }
  }, [documentType]);

  const resetForm = () => {
    if (documentType) {
      form.setValue("documentType", documentType);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSaving(true);
      console.log(values);
      const res = await axios.put(`/documents/${documentId}`, {
        documentTypeId: values.documentType,
      });

      //update the documents list to reflect the changes
      const updatedDocument = res.data;

      queryClient.setQueryData<DocumentType[] | undefined>(
        ["document-lists"],
        (oldData) => {
          if (!oldData) return oldData;

          return oldData.map((documentList) => {
            if (documentList.id === updatedDocument.document_type_id) {
              const oldDocument = documentList.documents.find(
                (document) => document.id === updatedDocument.id
              );

              if (oldDocument) {
                // Replace the old document with the updated document
                return {
                  ...documentList,
                  documents: documentList.documents.map((document) =>
                    document.id === updatedDocument.id
                      ? updatedDocument
                      : document
                  ),
                };
              } else {
                // Add the updated document to the list if not found
                return {
                  ...documentList,
                  documents: [...documentList.documents, updatedDocument],
                };
              }
            } else {
              // Filter out the document if its type does not match
              return {
                ...documentList,
                documents: documentList.documents.filter(
                  (document) => document.id !== updatedDocument.id
                ),
              };
            }
          });
        }
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden rounded-none">
        <DialogHeader className="pt-6 px-6">
          <DialogTitle className="text-2xl text-center font-bold capitalize">
            Edit Document
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2 px-8">
              <FormField
                control={form.control}
                name="documentType"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Document Type *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={"Select document type"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {documentLists?.map((documentList) => (
                          <SelectItem
                            key={documentList.id}
                            value={documentList.id.toString()}
                          >
                            {documentList.type_name}
                          </SelectItem>
                        ))}
                        {/* <SelectItem value="resume">Resume</SelectItem>
                        <SelectItem value="coverLetter">
                          Cover Letter
                        </SelectItem> */}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="job"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Related Job</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={"Select a job"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Select a job</SelectItem>
                        {savedJobs.map((job) => (
                          <SelectItem key={job.id} value={job.id.toString()}>
                            {`${job.job_title} at ${job.company_name}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              /> */}
            </div>

            <DialogFooter className="bg-gray-100 px-6 py-4">
              <div className="flex items-center ml-auto">
                <Button
                  variant="ghost"
                  className="mr-2 hover:text-zinc-500"
                  onClick={() => {
                    resetForm();
                    handleCloseModal();
                  }}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="text-white bg-blue-500 hover:bg-blue-600"
                  type="submit"
                  disabled={isSaving}
                >
                  Save changes
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDocumentModal;
