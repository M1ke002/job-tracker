import React, { useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownCircle, PlusCircle } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";

import ContactItem from "@/components/contact/ContactItem";
import ContactType from "@/types/Contact";

import { useModal } from "@/stores/useModal";

interface ContactProps {
  contacts: ContactType[] | undefined;
  jobId: number | undefined;
}

const Contact = ({ contacts, jobId }: ContactProps) => {
  const { onOpen } = useModal();
  const [rotateChevron, setRotateChevron] = useState(false);
  const handleRotate = () => setRotateChevron(!rotateChevron);
  const rotate = rotateChevron ? "rotate(-180deg)" : "rotate(0)";
  return (
    <Collapsible defaultOpen={true}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold mb-2">Contacts</h2>
        <CollapsibleTrigger>
          <ChevronDownCircle
            className="text-blue-600 cursor-pointer transition"
            style={{ transform: rotate, transition: "all 0.2s linear" }}
            size={23}
            onClick={handleRotate}
          />
        </CollapsibleTrigger>
      </div>
      <hr className="mt-2 mb-3 border-[#d6eaff]" />
      <CollapsibleContent>
        <Input placeholder="Search contacts" className="w-full mb-2" />
        {contacts?.map((contact) => (
          <ContactItem key={contact.id} contact={contact} />
        ))}
        <Button
          variant="primary"
          className="flex items-center justify-center mt-3 w-full"
          onClick={() => onOpen("createContact", { jobId: jobId?.toString() })}
        >
          <PlusCircle size={20} className="mr-2" />
          Add a contact
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default Contact;
