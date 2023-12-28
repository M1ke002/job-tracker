import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash } from "lucide-react";

const DocumentTable = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Job</TableHead>
          <TableHead>Created date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Resume.pdf</TableCell>
          <TableCell>Resume</TableCell>
          <TableCell>Software developer</TableCell>
          <TableCell>12/12/2021</TableCell>
          <TableHead className="flex items-center justify-end">
            <Trash size={20} />
          </TableHead>
        </TableRow>
        <TableRow>
          <TableCell>Resume.pdf</TableCell>
          <TableCell>Resume</TableCell>
          <TableCell>Software developer</TableCell>
          <TableCell>12/12/2021</TableCell>
          <TableHead className="flex items-center justify-end">
            <Trash size={20} />
          </TableHead>
        </TableRow>
        <TableRow>
          <TableCell>Resume.pdf</TableCell>
          <TableCell>Resume</TableCell>
          <TableCell>Software developer</TableCell>
          <TableCell>12/12/2021</TableCell>
          <TableHead className="flex items-center justify-end">
            <Trash size={20} />
          </TableHead>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default DocumentTable;
