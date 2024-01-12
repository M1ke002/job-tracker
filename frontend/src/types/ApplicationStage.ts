import Job from "./Job";
import SavedJob from "./SavedJob";

interface ApplicationStage {
  id: number;
  stage_name: string;
  position: number;
  jobs: SavedJob[];
}

export default ApplicationStage;
