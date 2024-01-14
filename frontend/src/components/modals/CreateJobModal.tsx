import React from "react";

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
import { useModal } from "@/hooks/zustand/useModal";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  jobTitle: z.string(),
  companyName: z.string(),
  location: z.string(),
  salary: z.string().optional(),
  jobDescription: z.string(),
  jobUrl: z.string(),
});

const CreateJobModal = () => {
  const { type, isOpen, onClose, data } = useModal();

  const isModalOpen = isOpen && type === "createJob";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      companyName: "",
      location: "",
      salary: "",
      jobDescription: "",
      jobUrl: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    onClose();
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
                    <FormLabel className="font-semibold">Job Title</FormLabel>
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
                      URL for original job post
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
                      Company Name
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
                    <FormLabel className="font-semibold">
                      Salary (optional)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Salary" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Job Description
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Job Description" {...field} />
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
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="text-white bg-blue-500 hover:bg-blue-600"
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

export default CreateJobModal;
