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
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

import axios from "@/lib/axiosConfig";

import SavedJob from "@/types/SavedJob";

import { useModal } from "@/stores/useModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  jobTitle: z.string(),
  companyName: z.string(),
  location: z.string().optional(),
  salary: z.string().optional(),
  additionalInfo: z.string().optional(),
  jobUrl: z.string(),
});

const CreateJobModal = () => {
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();
  const { type, isOpen, onClose } = useModal();

  const isModalOpen = isOpen && type === "createJob";

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

  const createJobMutation = useMutation({
    mutationFn: async ({
      jobTitle,
      companyName,
      jobUrl,
      location,
      salary,
      additionalInfo,
    }: {
      jobTitle: string;
      companyName: string;
      jobUrl: string;
      location?: string | undefined;
      salary?: string | undefined;
      additionalInfo?: string | undefined;
    }) => {
      const res = await axios.post("/saved-jobs", {
        jobTitle,
        companyName,
        jobUrl,
        location,
        salary,
        additionalInfo,
      });
      return res.data;
    },
    onSuccess: (newJob: SavedJob) => {
      //update cache
      // await queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });

      queryClient.setQueryData(
        ["saved-jobs"],
        (oldData: SavedJob[] | undefined) => {
          if (!oldData) return oldData;
          return [...oldData, newJob];
        }
      );
    },
    onError: (error) => {
      console.error(error);
    },
    onSettled: () => {
      onClose();
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    createJobMutation.mutate({
      jobTitle: values.jobTitle,
      companyName: values.companyName,
      jobUrl: values.jobUrl,
      location: values.location,
      salary: values.salary,
      additionalInfo: values.additionalInfo,
    });
  };

  const handleCloseModal = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden rounded-none">
        <DialogHeader className="pt-6 px-6">
          <DialogTitle className="text-2xl text-center font-bold capitalize">
            Add new job posting
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
                    <FormLabel className="font-semibold">Job type</FormLabel>
                    <FormControl>
                      <Input placeholder="Job type" {...field} />
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
                  type="submit"
                  disabled={isSaving}
                >
                  Save job
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateJobModal;
