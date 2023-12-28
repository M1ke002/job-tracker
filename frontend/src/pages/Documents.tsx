import DocumentListTitle from "@/components/document/DocumentListTitle";
import DocumentTable from "@/components/document/DocumentTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, Search } from "lucide-react";
import React from "react";

const Documents = () => {
  return (
    <div className="mx-auto px-4 flex flex-col items-center max-w-[1450px]">
      <div className="flex items-center justify-between border-[#dce6f8] border-b-[1px] bg-white p-4 mt-3 rounded-md shadow-sm w-full">
        <div className="flex items-center">
          <Button className="mr-2 flex items-center">
            <Plus size={20} className="mr-2" />
            Document
          </Button>
          <Button className="mr-2 flex items-center">
            <Plus size={20} className="mr-2" />
            Document type
          </Button>
        </div>
        <div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search documents"
              className="border-[#c3dafe] border-[1px] pl-3 pr-10 py-2"
            />
            <Search
              size={20}
              className="mr-2 absolute right-2 top-3 text-[#3d3d3d]"
            />
          </div>
        </div>
      </div>

      <div className="mt-1 w-full">
        <DocumentListTitle />
        <Separator className="my-1 bg-[#d6eaff]" />
        <DocumentTable />
      </div>
    </div>
  );
};

export default Documents;
