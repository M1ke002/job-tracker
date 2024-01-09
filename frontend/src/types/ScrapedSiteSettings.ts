interface ScrapedSiteSettings {
  id: number;
  is_notification_enabled: boolean;
  is_notify_email: boolean;
  is_notify_notification: boolean;
  is_scrape_enabled: boolean;
  classification: string;
  job_type: string;
  location: string;
  search_keyword: string;
  work_type: string;
  scrape_frequency: number;
  max_pages_to_scrape: number;
}

export default ScrapedSiteSettings;
