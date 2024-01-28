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

import { useSavedJobs } from "@/hooks/zustand/useSavedJobs";
import { useModal } from "@/hooks/zustand/useModal";
import { useDocumentList } from "@/hooks/zustand/useDocumentList";

const formSchema = z.object({
  documentType: z.string(),
  job: z.string(),
});

const EditDocumentModal = () => {
  const { savedJobs } = useSavedJobs();
  const [isSaving, setIsSaving] = useState(false);
  const { type, isOpen, onClose, data } = useModal();

  const { documentId, documentType, jobId } = data;

  const isModalOpen = isOpen && type === "editDocument";
  const { documentLists, setDocumentLists } = useDocumentList();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentType: "",
      job: "none",
    },
  });

  useEffect(() => {
    if (documentType) {
      form.setValue("documentType", documentType);
    }
    if (jobId) {
      form.setValue("job", jobId);
    }
  }, [documentType, jobId]);

  useEffect(() => {
    console.log(documentLists);
  }, [documentLists]);

  const resetForm = () => {
    if (documentType) {
      form.setValue("documentType", documentType);
    }
    if (jobId) {
      form.setValue("job", jobId);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSaving(true);
      console.log(values);
      const res = await axios.put(`/documents/${documentId}`, {
        documentTypeId: values.documentType,
        jobId: values.job === "none" ? "" : values.job,
      });

      //update the documents list to reflect the changes
      const updatedDocument = res.data;
      const updatedDocumentLists = documentLists.map((documentList) => {
        if (documentList.id === updatedDocument.document_type_id) {
          const oldDocument = documentList.documents.find(
            (document) => document.id === updatedDocument.id
          );

          //if found, replace the old document with the updated document
          if (oldDocument) {
            return {
              ...documentList,
              documents: documentList.documents.map((document) =>
                document.id === updatedDocument.id ? updatedDocument : document
              ),
            };
          } else {
            //if not found, add the updated document to the list
            return {
              ...documentList,
              documents: [...documentList.documents, updatedDocument],
            };
          }
        } else {
          return {
            ...documentList,
            documents: documentList.documents.filter(
              (document) => document.id !== updatedDocument.id
            ),
          };
        }
      });
      setDocumentLists(updatedDocumentLists);
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

              <FormField
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
              />
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
