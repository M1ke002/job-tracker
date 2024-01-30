import { FileEdit, Linkedin, Mail, Trash, StickyNote } from "lucide-react";
import { useModal } from "@/hooks/zustand/useModal";
import axios from "@/lib/axiosConfig";
import { useCurrentSavedJob } from "@/hooks/zustand/useCurrentSavedJob";
import React from "react";
import Contact from "@/types/Contact";

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
    <div className="relative flex flex-col my-3 p-3 rounded-md bg-[#f1f6fa] border border-[#c3dafe] shadow-sm">
      <div className="flex items-center space-x-1 mb-1">
        <h3 className="text-lg text-gray-700 font-semibold">
          {contact.person_name}
        </h3>
        <span className="text-gray-500">-</span>
        <span className="text-gray-500">{contact.person_position}</span>
      </div>
      {contact.person_linkedin && (
        <span className="flex items-center space-x-1">
          <Linkedin size={18} />
          <a href="#" className="text-blue-700">
            {contact.person_linkedin}
          </a>
        </span>
      )}
      {contact.person_email && (
        <span className="flex items-center space-x-1">
          <Mail size={18} />
          <a href="#" className="text-blue-700">
            {contact.person_email}
          </a>
        </span>
      )}
      {contact.note && (
        <div className="flex flex-col mt-3">
          <p className="font-semibold">Notes:</p>
          <p className="text-gray-700 max-h-20 overflow-y-auto">
            {contact.note}
          </p>
        </div>
      )}
      <div className="absolute top-3 right-3 flex items-center space-x-1">
        <button
          className="border-none focus:outline-none text-blue-700 hover:text-blue-700/80"
          onClick={() => {
            console.log(contact);
            onOpen("editContact", { contact });
          }}
        >
          <FileEdit className="ml-1" size={20} />
        </button>
        <button
          className="border-none focus:outline-none text-rose-500 hover:text-rose-500/80"
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
          <Trash className="ml-1" size={20} />
        </button>
      </div>
    </div>
  );
};

export default ContactItem;
