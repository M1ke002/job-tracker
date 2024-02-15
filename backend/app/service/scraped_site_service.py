from app.model import db, ScrapedSite, ScrapedSiteSettings

from app.utils.scraper.scrape import scrape_all_job_listings
from app.utils.scraper.url_builder import ausgrad_url_builder, seek_url_builder
from app.utils.scraper.constants import GRAD_CONNECTION, SEEK
from sqlalchemy.orm.session import Session

from datetime import datetime


def get_all_scraped_sites_in_db(session: Session):
    query = session.query(ScrapedSite).all()
    return query


def get_all_scraped_sites():
    scrapedSites = get_all_scraped_sites_in_db(db.session)

    # first time db is empty -> need to create scraped sites
    if len(scrapedSites) == 0:
        # create scraped sites
        sites_to_scrape = [GRAD_CONNECTION, SEEK]
        for site in sites_to_scrape:
            # create scraped site settings object with default settings
            scrapedSiteSettings = ScrapedSiteSettings(
                scrape_frequency=1,
                is_notify_email=True,
                is_notify_on_website=True,
                max_pages_to_scrape=2,
                search_keyword="software engineer",
                job_type="all",
            )

            if site == GRAD_CONNECTION:
                scrapedSiteSettings.location = "australia"
                scrapedSiteSettings.classification = "engineering-software"
            elif site == SEEK:
                scrapedSiteSettings.location = "All Australia"
                scrapedSiteSettings.classification = (
                    "information-communication-technology"
                )

            # create scraped site object
            create_scraped_site(site, scrapedSiteSettings)

        scrapedSites = ScrapedSite.query.all()

    return [scrapedSite.to_dict() for scrapedSite in scrapedSites]


def get_scraped_site(scraped_site_id):
    scrapedSite = ScrapedSite.query.get(scraped_site_id)
    if scrapedSite is None:
        return None
    return scrapedSite.to_dict()


def create_scraped_site(website_name, scraped_site_settings):
    scrapedSite = ScrapedSite(
        website_name=website_name, scraped_site_settings=scraped_site_settings
    )
    db.session.add(scrapedSite)
    db.session.commit()
    return scrapedSite.to_dict()


def update_last_scraped_date_in_db(
    session: Session, scraped_site: ScrapedSite, date: datetime
):
    scraped_site.last_scrape_date = date
    session.commit()


async def scrape_site(scrape_site_id):
    # find scraped site
    scrapedSite = ScrapedSite.query.get(scrape_site_id)
    if scrapedSite is None:
        return None

    # get scraped site settings
    scrapedSiteSettings = scrapedSite.scraped_site_settings
    if scrapedSiteSettings is None:
        return None

    if scrapedSite.website_name == GRAD_CONNECTION:
        search_url = ausgrad_url_builder(
            scrapedSiteSettings.search_keyword,
            scrapedSiteSettings.job_type,
            scrapedSiteSettings.classification,
            scrapedSiteSettings.location,
        )
    elif scrapedSite.website_name == SEEK:
        search_url = seek_url_builder(
            scrapedSiteSettings.search_keyword,
            scrapedSiteSettings.job_type,
            scrapedSiteSettings.classification,
            scrapedSiteSettings.location,
        )

    # scrape site
    print(search_url)
    scraped_jobs = await scrape_all_job_listings(
        scrapedSite.website_name, search_url, scrapedSiteSettings.max_pages_to_scrape
    )

    # update scraped site last scrape date to db
    update_last_scraped_date_in_db(db.session, scrapedSite, datetime.now())

    return scraped_jobs
