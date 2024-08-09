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
import { Textarea } from "../ui/textarea";

import axios from "@/lib/axiosConfig";
import Contact from "@/types/Contact";

import { useCurrentSavedJob } from "@/stores/useCurrentSavedJob";
import { useModal } from "@/stores/useModal";

const formSchema = z.object({
  name: z.string(),
  position: z.string(),
  linkedin: z.string(),
  email: z.string(),
  note: z.string(),
});

const EditContactModal = () => {
  const { currentSavedJob, setCurrentSavedJob } = useCurrentSavedJob();
  const { type, isOpen, onClose, data } = useModal();
  const { contact } = data;

  const isModalOpen = isOpen && type === "editContact";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      position: "",
      linkedin: "",
      email: "",
      note: "",
    },
  });

  useEffect(() => {
    if (contact) {
      form.setValue("name", contact.person_name);
      form.setValue("position", contact.person_position);
      form.setValue("linkedin", contact.person_linkedin);
      form.setValue("email", contact.person_email);
      form.setValue("note", contact.note);
    }
  }, [contact, form]);

  const resetForm = () => {
    if (contact) {
      form.setValue("name", contact.person_name);
      form.setValue("position", contact.person_position);
      form.setValue("linkedin", contact.person_linkedin);
      form.setValue("email", contact.person_email);
      form.setValue("note", contact.note);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      const res = await axios.put(`/contacts/${contact?.id}`, {
        personName: values.name,
        personPosition: values.position,
        personLinkedin: values.linkedin,
        personEmail: values.email,
        note: values.note,
      });
      const editedContact: Contact = res.data;
      if (currentSavedJob) {
        //find and replace contact
        const updatedContacts = currentSavedJob.contacts.map((contact) => {
          if (contact.id === editedContact.id) {
            return editedContact;
          }
          return contact;
        });
        const updatedJob = {
          ...currentSavedJob,
          contacts: updatedContacts,
        };
        setCurrentSavedJob(updatedJob);
      }
    } catch (error) {
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
            Edit contact
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2 px-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Position" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Linkedin URL
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="linkedin url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Type your notes here" {...field} />
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

export default EditContactModal;
