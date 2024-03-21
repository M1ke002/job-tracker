import ApplicationStage from "./ApplicationStage";
import Contact from "./Contact";
import Document from "./Document";
import Task from "./Task";

interface SavedJob {
  id: number;
  job_title: string;
  company_name: string;
  location: string;
  job_description: string;
  job_date: string;
  job_url: string;
  salary: string;
  additional_info: string;
  notes: string;
  position: number;
  tasks: Task[];
  contacts: Contact[];
  documents: Document[];
  stage_id: number | null;
  stage: ApplicationStage | null;
  rejected_at_stage_id: number | null;
  applied_date: string | null;
  is_favorite: boolean;
  created_at: string;
}

export default SavedJob;
