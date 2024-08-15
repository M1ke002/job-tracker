import { format } from "date-fns";
import ApplicationStageType from "@/types/ApplicationStage";
import {
  ApplicationStageNames,
  GRAD_CONNECTION_URL,
  SEEK_URL,
} from "./constants";
import SavedJob from "@/types/SavedJob";
import { SAVED_STAGE } from "@/pages/SavedJobsPage";

export const getApplicationStatusCount = (
  applicationStages: ApplicationStageType[]
) => {
  const applicationStageMap: { [key: string]: number } = {
    Applied: 0,
    OA: 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0,
  };
  const applicationStatus: { name: string; count: number }[] = [];
  applicationStages.forEach((stage) => {
    switch (stage.stage_name) {
      case ApplicationStageNames.APPLIED:
        applicationStageMap.Applied += stage.jobs.length;
        break;
      case ApplicationStageNames.OA:
        applicationStageMap.OA += stage.jobs.length;
        break;
      case ApplicationStageNames.INTERVIEW:
        applicationStageMap.Interview += stage.jobs.length;
        break;
      case ApplicationStageNames.OFFER:
        applicationStageMap.Offer += stage.jobs.length;
        break;
      case ApplicationStageNames.REJECTED:
        applicationStageMap.Rejected += stage.jobs.length;
        break;
    }
  });

  const rejectedJobStageMap: { [key: string]: number } = {
    Applied: 0,
    OA: 0,
    Interview: 0,
    Offer: 0,
  };
  const stageRejected = applicationStages.find(
    (stage) => stage.stage_name === ApplicationStageNames.REJECTED
  );
  if (stageRejected) {
    stageRejected.jobs.forEach((job) => {
      // console.log(job);
      const currentStageName = applicationStages.find(
        (stage) => stage.id === job.rejected_at_stage_id
      )?.stage_name;
      // console.log(currentStageName);
      switch (currentStageName) {
        case ApplicationStageNames.OA:
          rejectedJobStageMap.OA += 1;
          break;
        case ApplicationStageNames.INTERVIEW:
          rejectedJobStageMap.OA += 1;
          rejectedJobStageMap.Interview += 1;
          break;
        case ApplicationStageNames.OFFER:
          rejectedJobStageMap.OA += 1;
          rejectedJobStageMap.Interview += 1;
          rejectedJobStageMap.Offer += 1;
          break;
        default:
          break;
      }
    });
  }
  // console.log(applicationStageMap);

  applicationStages.forEach((stage) => {
    switch (stage.stage_name) {
      case ApplicationStageNames.APPLIED:
        applicationStatus.push({
          name: "Applications",
          count:
            applicationStageMap.Applied +
            applicationStageMap.OA +
            applicationStageMap.Interview +
            applicationStageMap.Offer +
            applicationStageMap.Rejected,
        });
        break;
      case ApplicationStageNames.OA:
        applicationStatus.push({
          name: "Online Assessments",
          count:
            rejectedJobStageMap.OA +
            applicationStageMap.OA +
            applicationStageMap.Interview +
            applicationStageMap.Offer,
        });
        break;
      case ApplicationStageNames.INTERVIEW:
        applicationStatus.push({
          name: "Interviews",
          count:
            rejectedJobStageMap.Interview +
            applicationStageMap.Interview +
            applicationStageMap.Offer,
        });
        break;
      case ApplicationStageNames.OFFER:
        applicationStatus.push({
          name: "Offers",
          count: rejectedJobStageMap.Offer + applicationStageMap.Offer,
        });
        break;
      case ApplicationStageNames.REJECTED:
        applicationStatus.push({
          name: "Rejections",
          count: applicationStageMap.Rejected,
        });
        break;
    }
  });
  return applicationStatus;
};

//input: Sun, 14 Jan 2024 11:00:13 GMT.
//calc difference between current time and end time
export const getTimeDifference = (startDate: Date, endDate: Date) => {
  const timeDifference = endDate.getTime() - startDate.getTime();
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 6) {
    return format(startDate, "dd/MM/yyyy");
  } else if (days > 0) {
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

export const sydneyToUTCTime = (date: Date) => {
  //minus 10 hours to get correct time
  return new Date(date.getTime() - 10 * 60 * 60 * 1000);
};

export const ausgradUrlBuilder = (
  keyword: string,
  jobType: string,
  discipline: string,
  location: string
): string => {
  let url: string = GRAD_CONNECTION_URL + "/";

  if (jobType === "all") {
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

  if (jobType !== "all") {
    url += "/" + jobType.toLowerCase().replace(" ", "-");
  }

  url += "?sortmode=ListedDate";
  return url;
};

export const isTextEmpty = (text: string) => {
  // Regular expression to match HTML tags
  var htmlTagPattern = /<[^>]*>/g;

  // Extract all HTML tags from the input string
  var tags = text.match(htmlTagPattern);

  // If there are tags and they cover the entire input string, it contains only tags
  return tags && text.replace(htmlTagPattern, "").trim() === "";
};

//search fn for savedJobs
export const searchJobs = (savedJobs: SavedJob[], query: string) => {
  //reset to original list of saved jobs if empty query
  if (query.trim() === "") {
    return savedJobs;
  }

  const lowercasedQuery = query.toLowerCase();

  //search in job_title, job_description, company_name
  const filteredJobs = savedJobs
    .filter((job) => {
      const jobTitle = job.job_title?.toLowerCase() || "";
      const jobDescription = job.job_description?.toLowerCase() || "";
      const companyName = job.company_name?.toLowerCase() || "";

      return (
        jobTitle.includes(lowercasedQuery) ||
        jobDescription.includes(lowercasedQuery) ||
        companyName.includes(lowercasedQuery)
      );
    })
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  return filteredJobs;
};

//filtering fn for saved jobs
export const filterJobs = (savedJobs: SavedJob[], filteredStages: string[]) => {
  if (filteredStages.length === 0) {
    return savedJobs;
  }

  const filteredJobs = savedJobs.filter((job) => {
    //if job doesn't belong to any stages yet, match it with 'saved' stage
    if (job.stage === null) {
      return filteredStages.includes(SAVED_STAGE);
    }

    return filteredStages.includes(job.stage.stage_name);
  });

  return filteredJobs;
};

//pagination fn for saved jobs
export const paginateJobs = (
  savedJobs: SavedJob[],
  page: number = 0,
  perPage: number = 30
) => {
  const totalJobCount = savedJobs.length;
  const totalPages = Math.ceil(totalJobCount / perPage);

  // Calculate start and end indices for slicing the array
  const start = (page - 1) * perPage;
  const end = start + perPage;

  // Get the jobs for the current page
  const paginatedJobs = savedJobs.slice(start, end);

  return {
    paginatedJobs,
    totalPages,
    totalJobCount,
  };
};
