import Document from "./Document";

interface DocumentType {
  id: number;
  type_name: string;
  documents: Document[];
}

export default DocumentType;
