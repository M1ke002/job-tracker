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
import { useModal } from "@/hooks/zustand/useModal";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import axios from "@/lib/axiosConfig";
import { useSavedJobs } from "@/hooks/zustand/useSavedJobs";
import UploadFileZone from "../UploadFileZone";

const formSchema = z.object({
  documentName: z.string(),
  documentType: z.string(),
  relatedJob: z.string(),
});

const UploadDocumentModal = () => {
  const { savedJobs } = useSavedJobs();
  const [isSaving, setIsSaving] = useState(false);
  const { type, isOpen, onClose } = useModal();

  const isModalOpen = isOpen && type === "uploadDocument";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentName: "",
      documentType: "",
      relatedJob: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSaving(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
      onClose();
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
            Upload Document
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2 px-8">
              <FormField
                control={form.control}
                name="documentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Document name *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Document name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        <SelectItem value="resume">Resume</SelectItem>
                        <SelectItem value="coverLetter">
                          Cover Letter
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="relatedJob"
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

              <Label className="block font-semibold !my-3">
                Upload document *
              </Label>
              <UploadFileZone />
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
                  Save contact
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
