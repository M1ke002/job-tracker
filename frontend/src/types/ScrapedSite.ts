import JobListing from "./JobListing";
import ScrapedSiteSettings from "./ScrapedSiteSettings";

interface ScrapedSite {
  id: number;
  job_listings: JobListing[];
  total_job_count: number;
  total_pages: number;
  scraped_site_settings: ScrapedSiteSettings;
  scraped_site_settings_id: number;
  website_name: string;
  last_scrape_date: string;
}

export default ScrapedSite;
