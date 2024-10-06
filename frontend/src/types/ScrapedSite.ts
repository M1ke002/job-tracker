import JobListing from "./JobListing";
import ScrapedSiteSettings from "./ScrapedSiteSettings";

interface ScrapedSite {
  id: number;
  scraped_site_settings: ScrapedSiteSettings;
  scraped_site_settings_id: number;
  website_name: string;
  last_scrape_date: Date;
}

export default ScrapedSite;
