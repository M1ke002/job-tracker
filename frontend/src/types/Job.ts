interface Job {
  id: number;
  title: string;
  company: string;
  stageId: number;
  isPlaceholder?: boolean;
}

export default Job;
