from app.model import db, ScrapedSite, ScrapedSiteSettings, JobListing

from app.utils.scraper.scrape import scrapeAllJobListings
from app.utils.scraper.url_builder import ausgradUrlBuilder, seekUrlBuilder
from app.utils.scraper.helper import findNewJobListings, jobObjectToDict
from app.utils.scraper.constants import GRAD_CONNECTION, SEEK

from datetime import datetime, timezone, timedelta

def get_all_scraped_sites():
    scrapedSites = ScrapedSite.query.all()
    res = []

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
                is_notify_on_website=True,
                max_pages_to_scrape=2,
                search_keyword="software engineer",
            )

            if (site == GRAD_CONNECTION):
                scrapedSiteSettings.location = "australia"
                scrapedSiteSettings.job_type = "all"
                scrapedSiteSettings.classification = "engineering-software"
            elif (site == SEEK):
                scrapedSiteSettings.location = "All Australia"
                scrapedSiteSettings.job_type = "all"
                scrapedSiteSettings.classification = "information-communication-technology"

            #create scraped site object
            scrapedSite = ScrapedSite(
                website_name=site,
                scraped_site_settings=scrapedSiteSettings
            )
            
            db.session.add(scrapedSite)
        
        db.session.commit()
        scrapedSites = ScrapedSite.query.all()

    for scrapedSite in scrapedSites:
        scrapedSite_dict = scrapedSite.to_dict()
        
        #query job listings, paginate by 30/page and sort by created_at date, return first page and total pages
        job_listings = JobListing.query.filter_by(scraped_site_id=scrapedSite.id).order_by(JobListing.created_at.desc()).paginate(per_page=30, page=1, error_out=False)
        scrapedSite_dict['job_listings'] = [job.to_dict() for job in job_listings.items]
        scrapedSite_dict['total_pages'] = job_listings.pages
        scrapedSite_dict['total_job_count'] = JobListing.query.filter_by(scraped_site_id=scrapedSite.id).count()
        res.append(scrapedSite_dict)

    return res

def get_scraped_site(scraped_site_id):
    scrapedSite = ScrapedSite.query.get(scraped_site_id)
    if scrapedSite is None:
        return None
    
    scrapedSite_dict = scrapedSite.to_dict()
    #query job listings, paginate by 30/page and sort by created_at date, return first page and total pages
    job_listings = JobListing.query.filter_by(scraped_site_id=scrapedSite.id).order_by(JobListing.created_at.desc()).paginate(per_page=30, page=1, error_out=False)
    scrapedSite_dict['job_listings'] = [job.to_dict() for job in job_listings.items]
    scrapedSite_dict['total_pages'] = job_listings.pages
    scrapedSite_dict['total_job_count'] = JobListing.query.filter_by(scraped_site_id=scrapedSite.id).count()

    return scrapedSite_dict

async def scrape_site(scrape_site_id):
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
        search_url = seekUrlBuilder(scrapedSiteSettings.search_keyword, scrapedSiteSettings.job_type, scrapedSiteSettings.classification, scrapedSiteSettings.location)
   
    # scrape site
    print(search_url)
    scraped_jobs = await scrapeAllJobListings(scrapedSite.website_name, search_url, scrapedSiteSettings.max_pages_to_scrape)

    # update scraped site last scrape date to db
    scrapedSite.last_scrape_date = datetime.now()

    # get existing job listings from db
    existing_job_listings = JobListing.query.filter_by(scraped_site_id=scrapedSite.id).all()
    existing_job_dict = [jobObjectToDict(job) for job in existing_job_listings]

    # find new job listings
    new_jobs = findNewJobListings(existing_job_dict, scraped_jobs)

    print('Found new jobs: ', len(new_jobs))

    # update is_new to False for existing jobs, but delete it if its created_at is more than 3 days ago
    for existing_job_listing in existing_job_listings:
        cut_off_date = datetime.now() - timedelta(days=3)
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
    
    scrapedSite_dict = scrapedSite.to_dict()
    #query job listings, paginate by 30/page and sort by created_at date, return first page and total pages
    job_listings = JobListing.query.filter_by(scraped_site_id=scrapedSite.id).order_by(JobListing.created_at.desc()).paginate(per_page=30, page=1, error_out=False)
    scrapedSite_dict['job_listings'] = [job.to_dict() for job in job_listings.items]
    scrapedSite_dict['total_pages'] = job_listings.pages
    scrapedSite_dict['total_job_count'] = JobListing.query.filter_by(scraped_site_id=scrapedSite.id).count()

    return scrapedSite_dict
    