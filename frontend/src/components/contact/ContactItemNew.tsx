import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  FileEdit,
  Linkedin,
  Mail,
  Trash,
  StickyNote,
  Phone,
  MoreHorizontal,
} from "lucide-react";
import axios from "@/lib/axiosConfig";

import Contact from "@/types/Contact";

import { useCurrentSavedJob } from "@/stores/useCurrentSavedJob";
import { useModal } from "@/stores/useModal";

interface ContactItemProps {
  contact: Contact;
}

const ContactItem = ({ contact }: ContactItemProps) => {
  const { currentSavedJob, setCurrentSavedJob } = useCurrentSavedJob();
  const { onOpen } = useModal();

  const handleDeleteContact = async () => {
    try {
      const res = await axios.delete(`/contacts/${contact.id}`);
      if (currentSavedJob) {
        const updatedJob = {
          ...currentSavedJob,
          contacts: currentSavedJob.contacts.filter(
            (currContact) => currContact.id !== contact.id
          ),
        };
        setCurrentSavedJob(updatedJob);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="group relative flex flex-col my-2 sm:my-0 rounded-md border py-3 border-[#e4eefd] shadow bg-white">
      <div className="flex items-center space-x-1 mb-1 px-3">
        <h3 className="text-lg text-gray-700 font-semibold">
          {contact.person_name}
        </h3>
        <span className="text-gray-500">-</span>
        <span className="text-gray-500">{contact.person_position}</span>
      </div>

      <hr className="border-[#d5e4fc] my-2" />

      {contact.person_email && (
        <span className="flex items-center space-x-2 mr-4 px-3">
          <Mail size={15} />
          <p>{contact.person_email}</p>
        </span>
      )}

      {contact.person_email && (
        <span className="flex items-center space-x-2 mr-4 px-3">
          <Phone size={15} />
          <p>042 123 456</p>
        </span>
      )}

      {contact.person_linkedin && (
        <span className="flex items-center space-x-2 px-3">
          <Linkedin size={15} />
          <a
            href={contact.person_linkedin}
            target="_blank"
            className="text-[#0077b5] hover:underline"
          >
            LinkedIn profile
          </a>
        </span>
      )}

      {contact.note && (
        <div className="flex flex-col mt-1 px-3">
          <p className="font-semibold">Notes:</p>
          <p className="text-gray-700 max-h-20 overflow-y-auto">
            {contact.note}
          </p>
        </div>
      )}

      <div className="absolute top-2 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-md border-none focus:outline-none hover:text-zinc-600">
              <MoreHorizontal size={20} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="left">
            <DropdownMenuItem
              className="flex items-center cursor-pointer"
              onClick={() => {
                console.log(contact);
                onOpen("editContact", { contact });
              }}
            >
              <FileEdit size={18} className="mr-2 text-blue-500" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center cursor-pointer"
              onClick={() => {
                onOpen("deleteContact", {
                  confirmModalTitle: "Delete Contact",
                  confirmModalMessage:
                    "Are you sure you want to delete this contact?",
                  confirmModalConfirmButtonText: "Delete",
                  confirmModalAction: handleDeleteContact,
                });
              }}
            >
              <Trash size={18} className="mr-2 text-rose-500" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ContactItem;
