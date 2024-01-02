import Job from "./Job";

interface ApplicationStage {
  id: number;
  name: string;
  jobOrderIds: number[];
  jobs: Job[];
}

export default ApplicationStage;
