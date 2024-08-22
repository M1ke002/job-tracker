import React, { useEffect, useState } from "react";

import { CalendarIcon } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import axios from "@/lib/axiosConfig";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "../ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useModal } from "@/stores/useModal";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  taskName: z.string(),
  dueDate: z.date().optional(),
  isReminderEnabled: z.boolean(),
  isNotifyEmail: z.boolean(),
  isNotifyOnWebsite: z.boolean(),
});

const CreateTaskModal = () => {
  const { id: currentSavedJobId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { type, isOpen, onOpen, onClose } = useModal();

  const isModalOpen = isOpen && type === "createTask";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskName: "",
      isReminderEnabled: false,
      isNotifyEmail: false,
      isNotifyOnWebsite: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (!currentSavedJobId) return;

      console.log(data, currentSavedJobId);
      const res = await axios.post("/tasks", {
        jobId: currentSavedJobId,
        taskName: data.taskName,
        dueDate: data.dueDate,
        isReminderEnabled: data.isReminderEnabled,
        isNotifyEmail: data.isNotifyEmail,
        isNotifyOnWebsite: data.isNotifyOnWebsite,
      });

      //TODO: refetch data (saved jobs, application stages?)
      await queryClient.invalidateQueries({
        queryKey: ["job-details", currentSavedJobId],
      });

      // const newTask = res.data;
      // //update current saved job
      // if (currentSavedJob) {
      //   const newTasks = [...currentSavedJob.tasks, newTask];
      //   setCurrentSavedJob({ ...currentSavedJob, tasks: newTasks });
      // }
    } catch (error) {
      console.log(error);
    } finally {
      onClose();
    }
  };

  const handleCloseModal = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden max-w-[600px]">
        <DialogHeader className="pt-6 pb-2 px-6">
          <DialogTitle className="text-2xl text-center font-bold capitalize">
            Create Task
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2 px-6">
              <FormField
                control={form.control}
                name="taskName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Task Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Task Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="py-1">Due date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Label className="font-semibold">Enable Reminder</Label>
                <FormField
                  control={form.control}
                  name="isReminderEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border py-2 px-3 mt-2">
                      <div>
                        <FormDescription>
                          Get notified when the task is due
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          className="data-[state=checked]:bg-blue-500"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {form.watch("isReminderEnabled") && (
                <div className="flex flex-col space-y-2 w-full pt-2">
                  <Label>Notifications</Label>
                  <div className="flex items-center space-x-6 pt-1">
                    <FormField
                      control={form.control}
                      name="isNotifyEmail"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-center">
                          <FormControl>
                            <Switch
                              className="data-[state=checked]:bg-blue-500"
                              id="notifyEmail"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <Label
                            htmlFor="notifyEmail"
                            className="!my-0 ml-2 font-normal"
                          >
                            Email
                          </Label>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isNotifyOnWebsite"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-center">
                          <FormControl>
                            <Switch
                              className="data-[state=checked]:bg-blue-500"
                              id="notifyEmail"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <Label
                            htmlFor="notifyEmail"
                            className="!my-0 ml-2 font-normal"
                          >
                            On Website
                          </Label>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
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
                  Create
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskModal;
