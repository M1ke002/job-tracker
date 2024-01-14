import { FileEdit, Linkedin, Mail, Trash, StickyNote } from "lucide-react";
import { useModal } from "@/hooks/zustand/useModal";
import React from "react";

const ContactItem = () => {
  const { onOpen } = useModal();
  return (
    <div className="relative flex flex-col my-3 p-3 rounded-md bg-[#f1f6fa] border border-[#c3dafe] shadow-sm">
      <div className="flex items-center space-x-1 mb-1">
        <h3 className="text-lg text-gray-700 font-semibold">Mark Zuckerberg</h3>
        <span className="text-gray-500">-</span>
        <span className="text-gray-500">CEO/founder</span>
      </div>
      <span className="flex items-center space-x-1">
        <Linkedin size={18} />
        <a href="#" className="text-blue-700">
          Linkedin profile
        </a>
      </span>
      <span className="flex items-center space-x-1">
        <Mail size={18} />
        <a href="#" className="text-blue-700">
          abc@gmail.com
        </a>
      </span>
      <div className="absolute top-3 right-3 flex items-center space-x-1">
        <button className="border-none focus:outline-none text-gray-700 hover:text-gray-700/80">
          <StickyNote className="ml-1" size={20} />
        </button>
        <button className="border-none focus:outline-none text-blue-700 hover:text-blue-700/80">
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
              confirmModalAction: () => {
                console.log("delete contact");
              },
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
