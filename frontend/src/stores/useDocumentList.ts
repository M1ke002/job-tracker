import { create } from "zustand";
import DocumentType from "@/types/DocumentType";

interface DocumentListStore {
  documentLists: DocumentType[];
  setDocumentLists: (documentLists: DocumentType[]) => void;
}

//removed
export const useDocumentList = create<DocumentListStore>((set) => ({
  documentLists: [],
  setDocumentLists: (documentLists: DocumentType[]) => set({ documentLists }),
}));
