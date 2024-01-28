import React, { useEffect, useState } from "react";

import { DataTable } from "@/components/document/DataTable";
import { columns } from "@/components/document/DocumentTableColumns";
import DocumentListTitle from "@/components/document/DocumentListTitle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlignJustify, Plus, Search, Settings } from "lucide-react";
import DocumentType from "@/types/DocumentType";
import axios from "@/lib/axiosConfig";

import { useModal } from "@/hooks/zustand/useModal";
import { useSavedJobs } from "@/hooks/zustand/useSavedJobs";
import { useDocumentList } from "@/hooks/zustand/useDocumentList";

const DocumentsPage = () => {
  // const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const { documentLists, setDocumentLists } = useDocumentList();
  const { onOpen } = useModal();
  const { setSavedJobs, isFetched } = useSavedJobs();

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        // if (isFetched) return;
        const res = await axios.get("/saved-jobs");
        console.log(res.data);
        setSavedJobs(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSavedJobs();
  }, []);

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const res = await axios.get("/document-types");
        setDocumentLists(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDocumentTypes();
  }, []);

  return (
    <div className="mx-auto px-4 flex flex-col items-center max-w-[1450px]">
      {/* <div className="flex items-center justify-between border-[1px] border-[#c3dafe] bg-[#f0f4f7] p-4 mt-3 rounded-md w-full"> */}
      <div className="flex items-center justify-end space-x-3 w-full mt-5">
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outlinePrimary"
                className="flex items-center bg-white"
              >
                <AlignJustify size={20} className="mr-2" />
                Menu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom">
              <DropdownMenuItem
                className="flex items-center"
                onClick={() => onOpen("uploadDocument")}
              >
                <Plus size={18} className="mr-2 text-blue-500" />
                Add type
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center">
                <Settings size={18} className="mr-2 text-blue-700" />
                Edit type
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="relative flex items-center justify-between">
          <input
            type="text"
            placeholder="Search documents"
            className="text-sm rounded-sm border-blue-300 border-[1px] pl-3 pr-9 py-2 w-[230px] h-[40px]"
          />
          <Search size={20} className="mr-1 absolute right-2 text-[#3d3d3d]" />
        </div>
      </div>

      <div className="mt-3 w-full mb-2 space-y-2">
        {documentLists.map((documentList) => (
          <div key={documentList.id}>
            <DocumentListTitle title={documentList.type_name} />
            <hr className="mt-1 mb-3 border-[#d6eaff]" />
            <DataTable columns={columns} data={documentList.documents} />
          </div>
        ))}
        {/* <div>
          <DocumentListTitle title="Resume" />
          <Separator className="mt-1 mb-3 bg-[#d6eaff]" />
          <DataTable columns={columns} data={fakeData} />
        </div>

        <div>
          <DocumentListTitle title="Cover letter" />
          <Separator className="mt-1 mb-3 bg-[#d6eaff]" />
          <DataTable columns={columns} data={fakeData} />
        </div> */}
      </div>
    </div>
  );
};

export default DocumentsPage;
