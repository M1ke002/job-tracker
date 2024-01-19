from app.model import db, ScrapedSiteSettings

def edit_scraped_site_settings(scraped_site_settings_id, data):
    scraped_site_settings = ScrapedSiteSettings.query.get(scraped_site_settings_id)
    if scraped_site_settings is None:
        return None
    
    is_scrape_enabled = data.get('isScrapeEnabled')
    scrape_frequency = data.get('scrapeFrequency')
    max_pages_to_scrape = data.get('maxPagesToScrape')
    is_notify_email = data.get('isNotifyEmail')
    is_notify_on_website = data.get('isNotifyOnWebsite')
    search_keyword = data.get('searchKeyword')
    location = data.get('location')
    job_type = data.get('jobType')
    classification = data.get('classification')

    if not max_pages_to_scrape or not location or not job_type or not classification:
        return None
    
    scraped_site_settings.is_scrape_enabled = is_scrape_enabled
    scraped_site_settings.scrape_frequency = scrape_frequency
    scraped_site_settings.max_pages_to_scrape = max_pages_to_scrape
    scraped_site_settings.is_notify_email = is_notify_email
    scraped_site_settings.is_notify_on_website = is_notify_on_website
    scraped_site_settings.search_keyword = search_keyword
    scraped_site_settings.location = location
    scraped_site_settings.job_type = job_type
    scraped_site_settings.classification = classification

    db.session.commit()

    return scraped_site_settings.to_dict()