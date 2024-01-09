interface JobListing {
  id: number;
  job_title: string;
  company_name: string;
  location: string;
  job_description: string;
  job_date: string;
  job_url: string;
  salary: string;
  additional_info: string;
  is_new: boolean;
  scraped_site_id: number;
}

export default JobListing;
