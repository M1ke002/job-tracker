import React, { useState } from "react";

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
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FileIcon, X } from "lucide-react";

import axios from "@/lib/axiosConfig";
import UploadFileZone from "../UploadFileZone";

import { useModal } from "@/stores/useModal";
import { useDocumentList } from "@/stores/useDocumentList";
import { useSavedJobs } from "@/stores/useSavedJobs";

const formSchema = z.object({
  documentType: z.string(),
  job: z.string(),
});

const UploadDocumentModal = () => {
  const { savedJobs } = useSavedJobs();
  const [isSaving, setIsSaving] = useState(false);
  const { type, isOpen, onClose, data } = useModal();
  const [file, setFile] = useState<File | null>(null);

  const isModalOpen = isOpen && type === "uploadDocument";
  const { documentLists, setDocumentLists } = useDocumentList();
  const { job } = data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentType: "",
      job: "none",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSaving(true);
      console.log(values);
      if (!file) {
        console.log("No file selected");
        return;
      }
      const formData = new FormData();
      formData.append("file", file as File);
      formData.append("documentTypeId", values.documentType);
      formData.append("jobId", values.job === "none" ? "" : values.job);
      const res = await axios.post("/documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res.data);

      //update the documents list to add the new document
      const newDocument = res.data;
      const updatedDocumentLists = documentLists.map((documentList) => {
        if (documentList.id === newDocument.document_type_id) {
          return {
            ...documentList,
            documents: [...documentList.documents, newDocument],
          };
        }
        return documentList;
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
    setFile(null);
    form.reset();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden rounded-none">
        <DialogHeader className="pt-6 px-6">
          <DialogTitle className="text-2xl text-center font-bold capitalize">
            Upload Document
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2 px-8">
              {job && (
                <FormItem className="w-full">
                  <FormLabel>Linked Job</FormLabel>
                  <Input value={job.job_title} readOnly />
                </FormItem>
              )}

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

              <Label className="block font-semibold !my-3">
                Upload document *
              </Label>
              {file ? (
                <div className="relative flex items-center p-2 mt-2 rounded-md bg-zinc-200/30 dark:bg-background/10 border w-64">
                  <FileIcon className="w-10 h-10 fill-indigo-200 stroke-indigo-400" />
                  <div className="ml-2 text-sm text-black hover:underline overflow-hidden overflow-ellipsis whitespace-nowrap">
                    {file.name}
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="bg-rose-500 text-white p-1 rounded-full absolute top-1 right-1 shadow-sm"
                    type="button"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <UploadFileZone setFile={setFile} />
              )}
              {/* <div className="flex items-center justify-center h-[120px] !my-2 font-semibold rounded-md border-[2px] border-dashed border-[#b4cffa] cursor-pointer hover:bg-[#e6f0fd]">
                <p className=" text-gray-500">Drag & drop your document here</p>
                <input type="file" className="hidden" />
              </div> */}
            </div>

            <DialogFooter className="bg-gray-100 px-6 py-4">
              <div className="flex items-center ml-auto">
                <Button
                  variant="ghost"
                  className="mr-2 hover:text-zinc-500"
                  onClick={handleCloseModal}
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
                  Save
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentModal;
