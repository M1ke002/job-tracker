import Job from "./Job";

interface JobListing extends Job {
  is_new: boolean;
  scraped_site_id: number;
}

export default JobListing;
