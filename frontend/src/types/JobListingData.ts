import JobListing from "./JobListing";

interface JobListingData {
  job_listings: JobListing[];
  total_job_count: number;
  total_pages: number;
}

export default JobListingData;
