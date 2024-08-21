import React from "react";
import { ColumnDef, Row } from "@tanstack/react-table";
import {
  Trash,
  ArrowUpDown,
  MoreHorizontal,
  FileDown,
  FileEdit,
  Lightbulb,
} from "lucide-react";

import { Button } from "../ui/button";

import { format } from "date-fns";
import { sydneyToUTCTime } from "@/utils/utils";
import axios from "@/lib/axiosConfig";

import Document from "@/types/Document";
import DocumentType from "@/types/DocumentType";

import { useModal } from "@/stores/useModal";
import { useDocumentsQuery } from "@/hooks/queries/useDocumentsQuery";
import { useQueryClient } from "@tanstack/react-query";

const ActionCell = ({ row }: { row: Row<Document> }) => {
  const { data: documentLists, status: documentListsStatus } =
    useDocumentsQuery();
  const { onOpen } = useModal();
  const queryClient = useQueryClient();
  const { id, file_url, document_type_id } = row.original;

  const deleteDocument = async (id: number) => {
    try {
      console.log(id);
      const res = await axios.delete(`/documents/${id}`);

      //update the documents list to remove the deleted document
      queryClient.setQueryData<DocumentType[] | undefined>(
        ["document-lists"],
        (oldData) => {
          if (!oldData) return oldData;

          return oldData.map((documentList) => ({
            ...documentList,
            documents: documentList.documents.filter(
              (document) => document.id !== id
            ),
          }));
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-1">
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
            documentLists,
          });
        }}
      >
        <FileEdit size={18} />
      </button>
      <button className="text-purple-600 focus:outline-none" onClick={() => {}}>
        <Lightbulb size={18} />
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
    accessorKey: "jobs",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="flex items-center hover:bg-[#ebf4ff] px-1 font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Linked Jobs
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { jobs } = row.original;
      // const displayed_job_title = job_title
      //   ? job_title.length > 40
      //     ? job_title.substring(0, 40) + "..."
      //     : job_title
      //   : "– –";
      return <div>{jobs.length}</div>;
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
      //must - 10 hours to get the correct date
      const convertedDate = sydneyToUTCTime(new Date(date_uploaded));
      // console.log(date_uploaded, convertedDate);
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
