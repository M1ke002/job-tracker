from sqlalchemy.orm.session import Session
from app.model import db, ScrapedSite, ScrapedSiteSettings

from app.utils.scrapers.grad_connection_scraper import GradConnectionScraper, GRAD_CONNECTION
from app.utils.scrapers.seek_scraper import SeekScraper, SEEK

from datetime import datetime
from app.utils.utils import get_current_utc_time


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
                scrapedSiteSettings.classification = "information-communication-technology"

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
    scrapedSite = ScrapedSite(website_name=website_name, scraped_site_settings=scraped_site_settings)
    db.session.add(scrapedSite)
    db.session.commit()
    return scrapedSite.to_dict()


def update_last_scraped_date_in_db(session: Session, scraped_site: ScrapedSite, date: datetime):
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

    scraper = None

    if scrapedSite.website_name == GRAD_CONNECTION:
        scraper = GradConnectionScraper(scrapedSiteSettings)
    elif scrapedSite.website_name == SEEK:
        scraper = SeekScraper(scrapedSiteSettings)

    if scraper is None:
        return None

    # scrape site
    scraped_jobs = await scraper.scrape()

    # update scraped site last scrape date in db
    update_last_scraped_date_in_db(db.session, scrapedSite, get_current_utc_time())

    return scraped_jobs
