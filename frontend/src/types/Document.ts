import SavedJob from "./SavedJob";

interface Document {
  id: number;
  document_type_id: number;
  job_id: number | null;
  job: SavedJob | null;
  job_title: string | null;
  document_name: string;
  document_type_name: string;
  date_uploaded: string;
}

export default Document;
