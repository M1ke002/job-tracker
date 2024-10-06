import ApplicationStage from "./ApplicationStage";
import Contact from "./Contact";
import Document from "./Document";
import Job from "./Job";
import Task from "./Task";

interface SavedJob extends Job {
  notes: string;
  position: number;
  tasks: Task[];
  contacts: Contact[];
  documents: Document[];
  stage_id: number | null;
  stage: ApplicationStage | null;
  rejected_at_stage_id: number | null;
  applied_date: Date | null;
  is_favorite: boolean;
  created_at: Date;
}

export default SavedJob;
