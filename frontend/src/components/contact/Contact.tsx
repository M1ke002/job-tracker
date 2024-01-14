import React, { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownCircle } from "lucide-react";
import ContactItem from "@/components/contact/ContactItem";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/zustand/useModal";

const Contact = () => {
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
        <ContactItem />
        <ContactItem />
        <Button
          variant="primary"
          className="mt-2 w-full"
          onClick={() => onOpen("createContact")}
        >
          Add contact
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default Contact;
