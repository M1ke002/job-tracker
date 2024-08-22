import React, { useEffect } from "react";

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
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import axios from "@/lib/axiosConfig";

import { useQueryClient } from "@tanstack/react-query";
import { useModal } from "@/stores/useModal";

const formSchema = z.object({
  jobTitle: z.string(),
  companyName: z.string(),
  location: z.string().optional(),
  salary: z.string().optional(),
  additionalInfo: z.string().optional(),
  jobUrl: z.string(),
});

const EditSavedJobModal = () => {
  const { type, isOpen, onClose, data } = useModal();
  const queryClient = useQueryClient();

  const isModalOpen = isOpen && type === "editJob";
  const { currentSavedJob } = data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      companyName: "",
      location: "",
      salary: "",
      additionalInfo: "",
      jobUrl: "",
    },
  });

  useEffect(() => {
    if (currentSavedJob) {
      form.setValue("jobTitle", currentSavedJob.job_title);
      form.setValue("companyName", currentSavedJob.company_name);
      form.setValue("location", currentSavedJob.location || "");
      form.setValue("salary", currentSavedJob.salary || "");
      form.setValue("additionalInfo", currentSavedJob.additional_info || "");
      form.setValue("jobUrl", currentSavedJob.job_url);
    }
  }, [currentSavedJob, form]);

  const resetForm = () => {
    if (currentSavedJob) {
      form.setValue("jobTitle", currentSavedJob.job_title);
      form.setValue("companyName", currentSavedJob.company_name);
      form.setValue("location", currentSavedJob.location || "");
      form.setValue("salary", currentSavedJob.salary || "");
      form.setValue("additionalInfo", currentSavedJob.additional_info || "");
      form.setValue("jobUrl", currentSavedJob.job_url);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!currentSavedJob) return;

      const res = await axios.put(`/saved-jobs/${currentSavedJob.id}`, values);

      await queryClient.invalidateQueries({
        queryKey: ["job-details", currentSavedJob.id],
      });
      //TODO: refetch data?
    } catch (error) {
      console.log(error);
    } finally {
      onClose();
    }
  };

  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-6 pb-2 px-6">
          <DialogTitle className="text-2xl text-center font-bold capitalize">
            Edit Job
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2 px-8">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Job Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Job Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      URL of original job post *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Company Name *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Company Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Salary</FormLabel>
                    <FormControl>
                      <Input placeholder="Salary" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Job Type</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Full-time, internship, graduate job..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

export default EditSavedJobModal;
