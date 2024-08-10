import SavedJob from "./SavedJob";

interface Document {
  id: number;
  document_type_id: number;
  jobs: { id: number; job_title: string }[];
  file_name: string;
  file_url: string;
  document_type_name: string;
  date_uploaded: string;
}

export default Document;
