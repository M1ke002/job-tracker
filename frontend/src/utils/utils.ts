import ApplicationStageType from "@/types/ApplicationStage";

export const getApplicationStatusCount = (
  applicationStages: ApplicationStageType[]
) => {
  const applicationStageMap: { [key: string]: number } = {
    Applied: 0,
    "O.A.": 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0,
  };
  const applicationStatus: { name: string; count: number }[] = [];
  applicationStages.forEach((stage) => {
    switch (stage.stage_name) {
      case "Applied":
        applicationStageMap["Applied"] += stage.jobs.length;
        break;
      case "O.A.":
        applicationStageMap["O.A."] += stage.jobs.length;
        break;
      case "Interview":
        applicationStageMap["Interview"] += stage.jobs.length;
        break;
      case "Offer":
        applicationStageMap["Offer"] += stage.jobs.length;
        break;
      case "Rejected":
        applicationStageMap["Rejected"] += stage.jobs.length;
        break;
    }
  });
  applicationStages.forEach((stage) => {
    switch (stage.stage_name) {
      case "Applied":
        applicationStatus.push({
          name: "Applied",
          count:
            applicationStageMap["Applied"] +
            applicationStageMap["O.A."] +
            applicationStageMap["Interview"] +
            applicationStageMap["Offer"] +
            applicationStageMap["Rejected"],
        });
        break;
      case "O.A.":
        applicationStatus.push({
          name: "O.A.",
          count:
            applicationStageMap["O.A."] +
            applicationStageMap["Interview"] +
            applicationStageMap["Offer"],
        });
        break;
      case "Interviewing":
        applicationStatus.push({
          name: "Interviews",
          count:
            applicationStageMap["Interview"] + applicationStageMap["Offer"],
        });
        break;
      case "Offer":
        applicationStatus.push({
          name: "Offers",
          count: applicationStageMap["Offer"],
        });
        break;
      case "Rejected":
        applicationStatus.push({
          name: "Rejected",
          count: applicationStageMap["Rejected"],
        });
        break;
    }
  });
  return applicationStatus;
};
