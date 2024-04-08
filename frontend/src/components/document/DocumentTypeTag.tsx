import { cn } from "@/lib/utils";
import React from "react";

interface DocumentTypeTagProps {
  documentType: string;
}

const DocumentTypeTag = ({ documentType }: DocumentTypeTagProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center text-sm py-1 px-2 border rounded-md font-semibold bg-[#e9fce6] text-[#29db0e] -tracking-[0.1px] leading-[1rem] capitalize",
        documentType === "resume" && "bg-[#e5f0ff] text-[#0070fb]",
        documentType === "cover letter" && "bg-[#fff4e5] text-[#ff8c00]"
      )}
    >
      {documentType}
    </div>
  );
};

export default DocumentTypeTag;
