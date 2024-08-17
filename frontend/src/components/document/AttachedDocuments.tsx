import React, { useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownCircle } from "lucide-react";

import Document from "@/types/Document";
import AttachedDocumentItem from "./AttachedDocumentItem";

interface AttachedDocumentsProps {
  documents: Document[];
}

const AttachedDocuments = ({ documents }: AttachedDocumentsProps) => {
  const [rotateChevron, setRotateChevron] = useState(false);

  const handleRotate = () => setRotateChevron(!rotateChevron);
  const rotate = rotateChevron ? "rotate(-180deg)" : "rotate(0)";

  return (
    <Collapsible defaultOpen={true}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold mb-2">Documents</h2>
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
        {documents.map((document) => (
          <AttachedDocumentItem
            key={document.id}
            id={document.id.toString()}
            documentName={document.file_name}
            documentType={document.document_type_name}
            documentUrl={document.file_url}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AttachedDocuments;
