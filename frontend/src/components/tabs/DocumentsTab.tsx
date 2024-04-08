import React from "react";
import { Button } from "../ui/button";
import { FolderClosedIcon, FolderSearch, Link, PlusCircle } from "lucide-react";
import AttachedDocumentItemNew from "../document/AttachedDocumentItemNew";

const documents: {
  id: number;
  documentName: string;
  documentType: string;
  documentUrl: string;
}[] = [
  {
    id: 1,
    documentName: "Mike_Resume_Dolby.pdf",
    documentType: "resume",
    documentUrl: "https://www.google.com",
  },
  {
    id: 2,
    documentName: "Mike_Cover_Letter_Dolby.docx",
    documentType: "cover letter",
    documentUrl: "https://www.google.com",
  },
];

const DocumentsTab = () => {
  return (
    <div>
      <div className="font-semibold flex items-center justify-between">
        <p className="text-lg">Documents: 2</p>
        <div className="space-x-3">
          <Button variant="primary">
            <PlusCircle size={20} className="mr-2" />
            Add document
          </Button>
          <Button
            variant="outlinePrimary"
            className="text-[#3d3d3d] hover:text-[#3d3d3d] px-2 bg-white"
          >
            <Link size={20} className="mr-2" />
            Link document
          </Button>
        </div>
      </div>
      <hr className="mt-4 mb-5 border-[#d6eaff]" />

      {documents.length === 0 && (
        <div className="flex flex-col items-center justify-center space-y-3 min-h-[200px]">
          <FolderSearch size={50} className="text-gray-300" />
          <p className="text-lg text-gray-500">No documents attached</p>
        </div>
      )}

      {documents.length > 0 && (
        <div className="grid grid-cols-1 gap-1 lg:grid-cols-2 xl:grid-cols-3 sm:gap-4 w-full">
          {documents.map((document) => (
            <AttachedDocumentItemNew
              key={document.id}
              id={document.id.toString()}
              documentName={document.documentName}
              documentType={document.documentType}
              documentUrl={document.documentUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentsTab;
