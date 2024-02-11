#script used to run the scraper every day and update the database
import os 

from dotenv import load_dotenv
load_dotenv()

from datetime import datetime, timezone, timedelta
from app.utils.scraper.scrape import scrape_all_job_listings
from app.utils.scraper.helper import find_new_job_listings
from app.utils.scraper.constants import SEEK, GRAD_CONNECTION
from app.utils.scraper.url_builder import ausgrad_url_builder, seek_url_builder
from app.utils.utils import utc_to_vietnam_time

from sqlalchemy.orm.session import Session
from app.model import ScrapedSiteSettings, JobListing, ScrapedSite, Notification


def fetch_scrape_site_settings(session: Session, site_id: int):
    query = session.query(ScrapedSiteSettings).filter(ScrapedSiteSettings.id == site_id)
    return query.first()


def fetch_all_scraped_sites(session: Session):
    query = session.query(ScrapedSite).all()
    return query


def fetch_all_job_listings(session: Session, scraped_site_id: int):
    query = session.query(JobListing).filter(JobListing.scraped_site_id == scraped_site_id)
    return query.all()


#update the is_new field of the job listings to false
def update_job_listings(session: Session, jobs: list[JobListing]):
    for job in jobs:
        job.is_new = False
    session.commit()


#delete all old job listings where created_at is older than 3 days
def delete_old_job_listings(session: Session):
    cutoff_date = utc_to_vietnam_time(datetime.now()) - timedelta(days=3)
    session.query(JobListing).filter(JobListing.created_at < cutoff_date).delete()
    session.commit()


def add_job_listings(session: Session, jobs: list[JobListing]):
    for job in jobs:
        session.add(job)
    session.commit()


def update_last_scraped_date(session: Session, scraped_site_id: int, date: datetime):
    query = session.query(ScrapedSite).filter(ScrapedSite.id == scraped_site_id)
    site = query.first()
    if site is None:
        return
    
    site.last_scrape_date = date
    session.commit()
    

def create_notification(session: Session, scraped_site_id: int, website_name: str, new_jobs_count: int):
    #create a new notification and save it to the database
    message = f"Found {new_jobs_count} new jobs on {website_name}"
    notification = Notification(
        scraped_site_id=scraped_site_id,
        message=message,
        is_read=False,
        created_at=utc_to_vietnam_time(datetime.now())
    )
    session.add(notification)
    session.commit()


def write_to_log(found_jobs_dict: dict[str, list]):
    now = utc_to_vietnam_time(datetime.now())
    dt_string = now.strftime("%d/%m/%Y %H:%M:%S")

    text = f"Scheduled job ran at {dt_string}. Found "
    for site_name, jobs in found_jobs_dict.items():
        text += f"{len(jobs)} new jobs for site: {site_name}, "

    #remove the last 2 characters, which are ', '
    text = text[:-2]
    text += '.'
    with open('log.txt', 'a') as f:
        f.write(text + '\n')


#main function
async def scrape_schedule(session: Session):
    email_data = {
        'type': 'scrape_schedule',
        'data': []
    }
    found_jobs_dict = {
        GRAD_CONNECTION: [],
        SEEK: []
    }

    #delete all old job listings where created_at is older than 3 days
    delete_old_job_listings(session)

    # get all scraped sites settings
    scraped_sites = fetch_all_scraped_sites(session)

    if len(scraped_sites) == 0:
        print('No scraped sites found')
        return
    
    for scraped_site in scraped_sites:
        #get scraped site settings for each site
        scraped_site_settings = fetch_scrape_site_settings(session, scraped_site.id)

        if scraped_site_settings is None:
            print(f"No scraped site settings found for site: {scraped_site.website_name}")
            continue

        if scraped_site_settings.scrape_frequency == -1:
            print(f"Scraping is disabled for site: {scraped_site.website_name}")
            continue
    
        search_url = ''
        if (scraped_site.website_name == GRAD_CONNECTION):
            search_url = ausgrad_url_builder(
                scraped_site_settings.search_keyword,
                scraped_site_settings.job_type, 
                scraped_site_settings.classification, 
                scraped_site_settings.location
            )
        elif (scraped_site.website_name == SEEK):
            search_url = seek_url_builder(
                scraped_site_settings.search_keyword, 
                scraped_site_settings.job_type, 
                scraped_site_settings.classification, 
                scraped_site_settings.location
            )
        print(scraped_site.website_name, search_url)

        #scrape all job listings, return: list of dicts of scraped jobs
        scraped_jobs = await scrape_all_job_listings(
            scraped_site.website_name, 
            search_url, 
            scraped_site_settings.max_pages_to_scrape
        )

        # get all job listings from db
        old_job_objects = fetch_all_job_listings(session, scraped_site.id)
        old_jobs = []

        #convert old job objects to list of dict
        old_jobs = [job.to_dict() for job in old_job_objects]

        # find new job listings. input: 2 lists of dicts. return: list of dicts
        new_jobs = find_new_job_listings(old_jobs, scraped_jobs)
        new_jobs_objects = []

        #convert new jobs to list of JobListing objects
        for new_job in new_jobs:
            job_object = JobListing(
                scraped_site_id=scraped_site.id,
                job_title=new_job['job_title'],
                company_name=new_job['company_name'],
                location=new_job['location'],
                job_description=new_job['job_description'],
                additional_info=new_job['additional_info'],
                salary=new_job['salary'],
                job_url=new_job['job_url'],
                job_date=new_job['job_date'],
                is_new=new_job['is_new'],
                created_at=utc_to_vietnam_time(datetime.now())
            )
            new_jobs_objects.append(job_object)

        total_new_jobs_count = len(new_jobs)
        print(f'Found {total_new_jobs_count} new jobs for site: {scraped_site.website_name}')

        #add new jobs to the found_jobs_dict
        found_jobs_dict[scraped_site.website_name] = new_jobs

        # update the is_new field of the existing job listings to false
        update_job_listings(session, old_job_objects)
        # insert new job listings
        add_job_listings(session, new_jobs_objects)

        if len(new_jobs) > 0 and scraped_site_settings.is_notify_on_website:
            #create a new notification
            create_notification(session, scraped_site.id, scraped_site.website_name, total_new_jobs_count)

        if len(new_jobs) > 0 and scraped_site_settings.is_notify_email:
            email_data['data'].append({
                'site_name': scraped_site.website_name,
                'jobs': new_jobs
            })

        #update the last scraped date
        update_last_scraped_date(session, scraped_site.id, utc_to_vietnam_time(datetime.now()))

    # write to a log.txt file
    write_to_log(found_jobs_dict)

    return email_data 