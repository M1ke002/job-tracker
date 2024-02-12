interface ScrapedSiteSettings {
  id: number;
  is_notify_email: boolean;
  is_notify_on_website: boolean;
  classification: string;
  job_type: string;
  location: string;
  search_keyword: string;
  scrape_frequency: number;
  max_pages_to_scrape: number;
}

export default ScrapedSiteSettings;
