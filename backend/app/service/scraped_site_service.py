from app.model import db, ScrapedSite, ScrapedSiteSettings, JobListing

from app.utils.scraper.scrape import getAllJobListings
from app.utils.scraper.url_builder import ausgradUrlBuilder, seekUrlBuilder
from app.utils.scraper.helper import findNewJobListings, jobObjectToDict
from app.utils.scraper.constants import GRAD_CONNECTION, SEEK

from datetime import datetime, timezone, timedelta

def get_all_scraped_sites():
    scrapedSites = ScrapedSite.query.all()

    #first time db is empty -> need to create scraped sites
    if (len(scrapedSites) == 0):
        #create scraped sites
        sites_to_scrape = [GRAD_CONNECTION, SEEK]
        for site in sites_to_scrape:
            #create scraped site settings object with default settings
            scrapedSiteSettings = ScrapedSiteSettings(
                is_scrape_enabled=True,
                scrape_frequency=1,
                is_notification_enabled=True,
                is_notify_email=True,
                is_notify_notification=True,
                max_pages_to_scrape=2,
                search_keyword="software engineer",
            )

            if (site == GRAD_CONNECTION):
                scrapedSiteSettings.location = "australia"
                scrapedSiteSettings.job_type = ""
                scrapedSiteSettings.classification = "engineering-software"
            elif (site == SEEK):
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
    
    if (scrapedSite.website_name == GRAD_CONNECTION):
        search_url = ausgradUrlBuilder(scrapedSiteSettings.search_keyword, scrapedSiteSettings.job_type, scrapedSiteSettings.classification, scrapedSiteSettings.location)
    elif (scrapedSite.website_name == SEEK):
        search_url = seekUrlBuilder(scrapedSiteSettings.search_keyword, scrapedSiteSettings.work_type, scrapedSiteSettings.classification, scrapedSiteSettings.location)
   
    # scrape site
    scraped_jobs = getAllJobListings(scrapedSite.website_name, search_url, scrapedSiteSettings.max_pages_to_scrape)

    # update scraped site last scrape date to db
    scrapedSite.last_scrape_date = datetime.now()

    # get existing job listings from db
    existing_job_listings = JobListing.query.filter_by(scraped_site_id=scrapedSite.id).all()
    existing_job_dict = [jobObjectToDict(job) for job in existing_job_listings]

    # find new job listings
    new_jobs = findNewJobListings(existing_job_dict, scraped_jobs)

    # update is_new to False for existing jobs, but delete it if its created_at is more than 3 days ago
    for existing_job_listing in existing_job_listings:
        cut_off_date = datetime.utcnow() - timedelta(days=3)
        if (existing_job_listing.created_at < cut_off_date):
            db.session.delete(existing_job_listing)
        else:
            if (existing_job_listing.is_new): 
                existing_job_listing.is_new = False

    # add new job listings to db
    for job_listing in new_jobs:
        job_listing = JobListing(
            scraped_site_id=scrapedSite.id,
            job_title=job_listing['job_title'],
            company_name=job_listing['company_name'],
            location=job_listing['location'],
            job_description=job_listing['job_description'],
            additional_info=job_listing['additional_info'],
            salary=job_listing['salary'],
            job_url=job_listing['job_url'],
            job_date=job_listing['job_date'],
            is_new=job_listing['is_new']
        )
        db.session.add(job_listing)

    db.session.commit()

    #get new scraped site
    scrapedSite = ScrapedSite.query.get(scrape_site_id)
    if scrapedSite is None:
        return None
    
    return scrapedSite.to_dict()
    