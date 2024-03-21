import React from "react";
import { ColumnDef, Row } from "@tanstack/react-table";
import {
  Trash,
  ArrowUpDown,
  MoreHorizontal,
  FileDown,
  FileEdit,
} from "lucide-react";
import { Button } from "../ui/button";
import { format } from "date-fns";

import Document from "@/types/Document";
import axios from "@/lib/axiosConfig";

import { useModal } from "@/stores/useModal";
import { useDocumentList } from "@/stores/useDocumentList";

const ActionCell = ({ row }: { row: Row<Document> }) => {
  const { documentLists, setDocumentLists } = useDocumentList();
  const { onOpen } = useModal();
  const { id, file_url, document_type_id, job_id } = row.original;

  const deleteDocument = async (id: number) => {
    try {
      console.log(id);
      const res = await axios.delete(`/documents/${id}`);

      //update the documents list to remove the deleted document
      const updatedDocumentLists = documentLists.map((documentList) => {
        return {
          ...documentList,
          documents: documentList.documents.filter(
            (document) => document.id !== id
          ),
        };
      });
      setDocumentLists(updatedDocumentLists);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        className="text-blue-500 focus:outline-none"
        onClick={() => {
          window.open(file_url, "_blank");
        }}
      >
        <FileDown size={18} />
      </button>
      <button
        className="text-blue-700 focus:outline-none"
        onClick={() => {
          onOpen("editDocument", {
            documentId: id.toString(),
            documentType: document_type_id.toString(),
            jobId: job_id ? job_id.toString() : "none",
          });
        }}
      >
        <FileEdit size={18} />
      </button>
      <button
        className="text-rose-500 focus:outline-none"
        onClick={() => {
          onOpen("deleteDocument", {
            confirmModalTitle: "Delete document",
            confirmModalMessage:
              "Are you sure you want to delete this document?",
            confirmModalConfirmButtonText: "Delete",
            confirmModalAction: () => {
              deleteDocument(id);
            },
          });
        }}
      >
        <Trash size={18} />
      </button>
    </div>
  );
};

export const columns: ColumnDef<Document>[] = [
  {
    accessorKey: "file_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="flex items-center hover:bg-[#ebf4ff] font-semibold px-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      // fixed width for the name column
      return <div className="truncate px-1">{row.original.file_name}</div>;
    },
  },
  {
    accessorKey: "document_type_name",
    header: "Type",
    cell: ({ row }) => {
      return <div className="truncate">{row.original.document_type_name}</div>;
    },
  },
  {
    accessorKey: "job_title",
    header: "Job",
    cell: ({ row }) => {
      const { job_title } = row.original;
      const displayed_job_title = job_title
        ? job_title.length > 40
          ? job_title.substring(0, 40) + "..."
          : job_title
        : "– –";
      return <div>{displayed_job_title}</div>;
    },
  },
  {
    accessorKey: "date_uploaded",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="flex items-center hover:bg-[#ebf4ff] px-1 font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Uploaded
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { date_uploaded } = row.original;
      console.log(date_uploaded, new Date(date_uploaded));
      //must - 11 hours to get the correct date
      const convertedDate = new Date(date_uploaded);
      convertedDate.setHours(convertedDate.getHours() - 11);
      return <div className="px-1">{format(convertedDate, "dd/MM/yyyy")}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center">Actions</div>,
    // action to delete a document (trash icon)
    cell: ActionCell,
  },
];
