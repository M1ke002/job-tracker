import React from "react";
import { Button } from "../ui/button";
import { Link, PlusCircle, UserSearch } from "lucide-react";
import Contact from "@/types/Contact";
import ContactItem from "../contact/ContactItemNew";

import { useCurrentSavedJob } from "@/stores/useCurrentSavedJob";
import { useModal } from "@/stores/useModal";

const ContactTab = () => {
  const { onOpen } = useModal();
  const { currentSavedJob, setCurrentSavedJob } = useCurrentSavedJob();
  const contacts = currentSavedJob?.contacts || [];
  const jobId = currentSavedJob?.id.toString();

  return (
    <div>
      <div className="font-semibold flex items-center justify-between">
        <p className="text-lg">Contacts: {contacts.length}</p>
        <div className="space-x-3">
          <Button
            variant="primary"
            onClick={() => onOpen("createContact", { jobId })}
          >
            <PlusCircle size={20} className="mr-2" />
            Add contact
          </Button>
          <Button
            variant="outlinePrimary"
            className="text-[#3d3d3d] hover:text-[#3d3d3d] px-2 bg-white"
          >
            <Link size={20} className="mr-2" />
            Link contact
          </Button>
        </div>
      </div>
      <hr className="mt-4 mb-5 border-[#d6eaff]" />

      {contacts.length === 0 && (
        <div className="flex flex-col items-center justify-center space-y-3 min-h-[200px]">
          <UserSearch size={50} className="text-gray-300" />
          <p className="text-lg text-gray-500">No contacts found</p>
        </div>
      )}

      {contacts.length > 0 && (
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4 w-full">
          {contacts.map((contact) => (
            <ContactItem key={contact.id} contact={contact} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactTab;
