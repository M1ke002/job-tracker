# script used to run the scraper every day and update the database
from datetime import datetime, timedelta
from app.utils.utils import find_new_job_listings

from app.utils.scrapers.seek_scraper import SeekScraper, SEEK
from app.utils.scrapers.grad_connection_scraper import (
    GradConnectionScraper,
    GRAD_CONNECTION,
)


from app.utils.utils import get_current_utc_time

from sqlalchemy.orm.session import Session
from app.model import JobListing, ScrapedSite

from app.service.notification_service import create_notification_in_db
from app.service.scraped_site_settings_service import get_scraped_site_settings_in_db
from app.service.scraped_site_service import (
    get_all_scraped_sites_in_db,
    update_last_scraped_date_in_db,
)
from app.service.job_listing_service import (
    get_all_job_listings_in_db_for_site,
    set_job_listings_is_new_in_db,
    create_job_listings_in_db,
    delete_all_old_job_listings_in_db,
)


def fetch_scrape_site_settings(session: Session, scraped_site_settings_id: int):
    return get_scraped_site_settings_in_db(session, scraped_site_settings_id)


def fetch_all_scraped_sites(session: Session):
    return get_all_scraped_sites_in_db(session)


def fetch_all_job_listings(session: Session, scraped_site_id: int):
    return get_all_job_listings_in_db_for_site(session, scraped_site_id)


# update the is_new field of the job listings to false
def set_job_listings_is_new(session: Session, jobs: list[JobListing], is_new: bool = False):
    set_job_listings_is_new_in_db(session, jobs, is_new)


# delete all old job listings where created_at is older than 7 days
def delete_old_job_listings(session: Session, current_date: datetime):
    cutoff_date = current_date - timedelta(days=7)
    delete_all_old_job_listings_in_db(session, cutoff_date)


def add_job_listings(session: Session, jobs: list[JobListing]):
    create_job_listings_in_db(session, jobs)


def update_last_scraped_date(session: Session, scraped_site: ScrapedSite, date: datetime):
    update_last_scraped_date_in_db(session, scraped_site, date)


def create_notification(session: Session, website_name: str, new_jobs_count: int, current_date: datetime):
    # create a new notification and save it to the database
    message = f"Found {new_jobs_count} new jobs on {website_name}"
    create_notification_in_db(
        session=session,
        message=message,
        created_at=current_date,
    )


# main function
async def web_scraper(session: Session):
    email_data = {"type": "web_scraper", "data": []}
    found_jobs_dict = {GRAD_CONNECTION: [], SEEK: []}
    current_date = get_current_utc_time()

    # delete all old job listings where created_at is older than 3 days
    delete_old_job_listings(session, current_date)

    # get all scraped sites settings
    scraped_sites = fetch_all_scraped_sites(session)

    if len(scraped_sites) == 0:
        print("No scraped sites found")
        return

    for scraped_site in scraped_sites:
        # get scraped site settings for each site
        scraped_site_settings = fetch_scrape_site_settings(session, scraped_site.scraped_site_settings_id)

        if scraped_site_settings is None:
            print(f"No scraped site settings found for site: {scraped_site.website_name}")
            continue

        if scraped_site_settings.scrape_frequency == -1:
            print(f"Scraping is disabled for site: {scraped_site.website_name}")
            continue

        scraper = None

        if scraped_site.website_name == GRAD_CONNECTION:
            scraper = GradConnectionScraper(scraped_site_settings)
        elif scraped_site.website_name == SEEK:
            scraper = SeekScraper(scraped_site_settings)

        if scraper is None:
            print(f"No scraper found for site: {scraped_site.website_name}. Skipping...")

        # scrape all job listings, return: list of dicts of scraped jobs
        scraped_jobs = await scraper.scrape()
        # print(scraped_jobs)

        # get all job listings for a website from db
        old_job_objects = fetch_all_job_listings(session, scraped_site.id)
        old_jobs = []

        # convert old job objects to list of dict
        old_jobs = [job.to_dict() for job in old_job_objects]

        # find new job listings. input: 2 lists of dicts. return: list of dicts
        new_jobs = find_new_job_listings(old_jobs, scraped_jobs)
        new_jobs_objects = []

        # convert new jobs to list of JobListing objects
        for new_job in new_jobs:
            job_object = JobListing(
                scraped_site_id=scraped_site.id,
                job_title=new_job["job_title"],
                company_name=new_job["company_name"],
                location=new_job["location"],
                job_description=new_job["job_description"],
                additional_info=new_job["additional_info"],
                salary=new_job["salary"],
                job_url=new_job["job_url"],
                job_date=new_job["job_date"],
                is_new=new_job["is_new"],
                created_at=current_date,
            )
            new_jobs_objects.append(job_object)

        total_new_jobs_count = len(new_jobs)
        print(f"Found {total_new_jobs_count} new jobs for site: {scraped_site.website_name}")

        # add new jobs to the found_jobs_dict
        found_jobs_dict[scraped_site.website_name] = new_jobs

        # update the is_new field of the existing job listings to false
        set_job_listings_is_new(session, old_job_objects, False)
        # insert new job listings
        add_job_listings(session, new_jobs_objects)

        if len(new_jobs) > 0 and scraped_site_settings.is_notify_on_website:
            # create a new notification
            create_notification(
                session=session,
                website_name=scraped_site.website_name,
                new_jobs_count=total_new_jobs_count,
                current_date=current_date,
            )

        if len(new_jobs) > 0 and scraped_site_settings.is_notify_email:
            email_data["data"].append({"site_name": scraped_site.website_name, "jobs": new_jobs})

        # update the last scraped date
        update_last_scraped_date(session, scraped_site, current_date)

    return email_data
