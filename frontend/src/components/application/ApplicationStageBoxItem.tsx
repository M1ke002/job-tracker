import { Contact, ListTodo, X } from "lucide-react";
import React from "react";

const ApplicationStageBoxItem = () => {
  return (
    // hover border blue
    <div className="flex flex-col relative group bg-white border-[1px] border-[#dce6f8] rounded-md p-3 mb-2 drop-shadow-sm hover:border-blue-400 hover:bg-[#f0f7fd] cursor-pointer">
      <p className="font-semibold">Software Developer</p>
      <p className="text-sm">Google</p>
      <p className="flex items-center mt-1 text-zinc-700">
        <Contact size={13} className="mr-1" />
        <ListTodo size={13} />
      </p>
      <X
        size={20}
        className="hidden group-hover:block absolute top-2 right-2 hover:text-red-500"
        style={{ opacity: 0.5 }}
      />
    </div>
  );
};

export default ApplicationStageBoxItem;
