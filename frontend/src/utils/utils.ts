import ApplicationStageType from "@/types/ApplicationStage";
import { GRAD_CONNECTION_URL, SEEK_URL } from "./constants";

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
      case "Interviewing":
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

//input: Sun, 14 Jan 2024 11:00:13 GMT.
//calc difference between current time and end time
export const getTimeDifference = (startTime: string, endTime: Date) => {
  //startDate must minus 7 hours to get correct time
  const startDate = new Date(startTime);
  const realStartDate = new Date(startDate.getTime() - 7 * 60 * 60 * 1000);
  const timeDifference = endTime.getTime() - realStartDate.getTime();
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) {
    return `${days}d ago`;
  } else if (hours > 0) {
    return `${hours}h ago`;
  } else if (minutes > 0) {
    return `${minutes}m ago`;
  } else if (seconds > 0) {
    return `${seconds}s ago`;
  } else {
    return "just now";
  }
};

export const ausgradUrlBuilder = (
  keyword: string,
  jobType: string,
  discipline: string,
  location: string
): string => {
  let url: string = GRAD_CONNECTION_URL + "/";

  if (jobType === "") {
    jobType = "jobs";
  }
  url += jobType.replace(" ", "-") + "/";

  if (discipline === "") {
    discipline = "engineering-software";
  }
  url += discipline.replace(" ", "-") + "/";

  if (location !== "") {
    url += location.toLowerCase() + "/";
  }

  if (keyword !== "") {
    url += "?title=" + keyword.replace(" ", "+");
  }

  if (keyword !== "") {
    url += "&";
  } else {
    url += "?";
  }

  url += "ordering=-recent_job_created";
  return url;
};

export const seekUrlBuilder = (
  keyword: string,
  jobType: string,
  classification: string,
  location: string
): string => {
  let url: string = SEEK_URL + "/";

  if (keyword !== "") {
    url += keyword.replace(" ", "-") + "-jobs";
  } else {
    url += "jobs";
  }

  if (classification === "") {
    classification = "information-communication-technology";
  }
  url += "-in-" + classification.toLowerCase().replace(" ", "-");

  if (location !== "") {
    url += "/in-" + location.replace(" ", "-");
  }

  if (jobType !== "") {
    url += "/" + jobType.toLowerCase().replace(" ", "-");
  }

  url += "?sortmode=ListedDate";
  return url;
};
