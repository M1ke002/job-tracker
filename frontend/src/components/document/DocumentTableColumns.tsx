import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Trash,
  ArrowUpDown,
  MoreHorizontal,
  FileDown,
  FileEdit,
} from "lucide-react";
import { Button } from "../ui/button";
import Document from "@/types/Document";

// export type Document = {
//   id: string;
//   name: string;
//   type: string;
//   job: string;
//   uploadedDate: string;
// };

export const columns: ColumnDef<Document>[] = [
  {
    accessorKey: "document_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="flex items-center hover:bg-[#ebf4ff] p-1 font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "document_type_name",
    header: "Type",
  },
  {
    accessorKey: "job_title",
    header: "Job",
  },
  {
    accessorKey: "date_uploaded",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="flex items-center hover:bg-[#ebf4ff] p-1 font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Uploaded
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center">Actions</div>,
    // action to delete a document (trash icon)
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center space-x-2">
          <button
            className="text-blue-500 focus:outline-none"
            onClick={() => {
              // deleteDocument(row.original.id);
            }}
          >
            <FileDown size={18} />
          </button>
          <button
            className="text-blue-700 focus:outline-none"
            onClick={() => {
              // deleteDocument(row.original.id);
            }}
          >
            <FileEdit size={18} />
          </button>
          <button
            className="text-rose-500 focus:outline-none"
            onClick={() => {
              // deleteDocument(row.original.id);
            }}
          >
            <Trash size={18} />
          </button>
        </div>
      );
    },
  },
];
