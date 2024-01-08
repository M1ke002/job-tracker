from app.model import db, ScrapedSite, ScrapedSiteSettings, JobListing

from app.utils.scraper.scrape import getAllJobListings
from app.utils.scraper.url_builder import ausgradUrlBuilder, seekUrlBuilder
from app.utils.scraper.helper import findNewJobListings

from datetime import datetime, timezone

def get_all_scraped_sites():
    scrapedSites = ScrapedSite.query.all()

    #first time db is empty -> need to create scraped sites
    if (len(scrapedSites) == 0):
        #create scraped sites
        sites_to_scrape = ['Grad Connection', 'Seek']
        for site in sites_to_scrape:
            #create scraped site settings object with default settings
            scrapedSiteSettings = ScrapedSiteSettings(
                is_scrape_enabled=True,
                scrape_frequency=1,
                is_notification_enabled=True,
                is_notify_email=True,
                is_notify_notification=True,
                search_keyword="software engineer",
            )

            if (site == 'Grad Connection'):
                scrapedSiteSettings.location = "australia"
                scrapedSiteSettings.job_type = ""
                scrapedSiteSettings.classification = "engineering-software"
            elif (site == 'Seek'):
                scrapedSiteSettings.location = "All Australia"
                scrapedSiteSettings.work_type = ""
                scrapedSiteSettings.classification = "information-communication-technology"

            #create scraped site object
            scrapedSite = ScrapedSite(
                website_name=site,
                scraped_site_settings=scrapedSiteSettings
            )
            
            db.session.add(scrapedSite)
        
        db.session.commit()
        scrapedSites = ScrapedSite.query.all()

    return [scrapedSite.to_dict() for scrapedSite in scrapedSites]

def get_scraped_site(scraped_site_id):
    scrapedSite = ScrapedSite.query.get(scraped_site_id)
    if scrapedSite is None:
        return None
    return scrapedSite.to_dict()

def scrape_site(scrape_site_id):
    #find scraped site
    scrapedSite = ScrapedSite.query.get(scrape_site_id)
    if scrapedSite is None:
        return None
    
    #get scraped site settings
    scrapedSiteSettings = scrapedSite.scraped_site_settings
    if scrapedSiteSettings is None:
        return None
    
    if (scrapedSite.website_name == "Grad Connection"):
        search_url = ausgradUrlBuilder(scrapedSiteSettings.search_keyword, scrapedSiteSettings.job_type, scrapedSiteSettings.classification, scrapedSiteSettings.location)
    elif (scrapedSite.website_name == "Seek"):
        search_url = seekUrlBuilder(scrapedSiteSettings.search_keyword, scrapedSiteSettings.work_type, scrapedSiteSettings.classification, scrapedSiteSettings.location)
   
    scraped_jobs = getAllJobListings(scrapedSite.website_name, search_url, scrapedSiteSettings.max_pages_to_scrape)

    # get existing job listings from db
    existing_job_listings = JobListing.query.filter_by(scraped_site_id=scrapedSite.id).all()

    # find new job listings
    new_job_listings = findNewJobListings(scraped_jobs, existing_job_listings)

    # remove all old job listings
    for job_listing in existing_job_listings:
        db.session.delete(job_listing)

    # add new job listings
    for job_listing in new_job_listings:
        db.session.add(job_listing)

    # update last scrape date
    scrapedSite.last_scrape_date = datetime.now(timezone.utc)

    db.session.commit()

    # website = "Grad Connection"
    # # search_url = "https://seek.com.au/Software-Engineer-jobs/in-All-Sydney-NSW?sortmode=ListedDate"
    # search_url = "https://au.gradconnection.com/internships/sydney/?title=Software+Engineer&ordering=-recent_job_created"
    # scraped_jobs = getAllJobListings(website, search_url, 2)
    return [job_listing.to_dict() for job_listing in new_job_listings]
    