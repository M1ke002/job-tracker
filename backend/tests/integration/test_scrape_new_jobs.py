from datetime import datetime
import pytest
from unittest.mock import patch
from app.utils.scrapers.seek_scraper import SEEK, SeekScraper
from app.scripts.tasks.scrape_new_jobs import web_scraper

from app.model import ScrapedSiteSettings, ScrapedSite, JobListing, Notification


@pytest.fixture
def mock_datetime():
    mock_datetime = patch("app.scripts.tasks.scrape_new_jobs.datetime").start()
    yield mock_datetime
    mock_datetime.stop()


@pytest.fixture
def mock_write_to_log():
    mock_write_to_log = patch("app.scripts.tasks.scrape_new_jobs.write_to_log").start()
    yield mock_write_to_log
    mock_write_to_log.stop()


@pytest.fixture
def setup_scraped_site_and_settings(database):
    scraped_site_settings = ScrapedSiteSettings(
        id=1,
        scrape_frequency=1,
        max_pages_to_scrape=1,
        is_notify_email=True,
        is_notify_on_website=True,
        search_keyword="software engineer",
        location="All Australia",
        job_type="Internships",
        classification="",
    )
    database.session.add(scraped_site_settings)
    database.session.commit()

    scraped_site = ScrapedSite(
        id=1,
        website_name=SEEK,
        scraped_site_settings_id=1,
    )
    database.session.add(scraped_site)
    database.session.commit()


@pytest.fixture
def setup_job_listings_data(database):
    job_listings = [
        JobListing(
            id=1,
            scraped_site_id=1,
            job_title="job1",
            company_name="company1",
            job_url="url1",
            created_at=datetime.strptime("2024-02-06", "%Y-%m-%d"),
        ),
        JobListing(
            id=2,
            scraped_site_id=1,
            job_title="job2",
            company_name="company2",
            job_url="url2",
            created_at=datetime.strptime("2024-02-13", "%Y-%m-%d"),
        ),
        JobListing(
            id=3,
            scraped_site_id=1,
            job_title="job3",
            company_name="company3",
            job_url="url3",
            created_at=datetime.strptime("2024-02-13", "%Y-%m-%d"),
        ),
    ]

    database.session.add_all(job_listings)
    database.session.commit()


@pytest.mark.asyncio
@pytest.mark.usefixtures("setup_scraped_site_and_settings", "setup_job_listings_data")
@patch.object(SeekScraper, "scrape")
async def test_new_jobs_found(
    mock_scrape,
    database,
    mock_datetime,
    mock_write_to_log,
):
    # mock the current date
    current_date = datetime.strptime("2024-02-14", "%Y-%m-%d")
    mock_datetime.now.return_value = current_date

    # mock the return value of scrape_all_job_listings to be a list of dicts
    # scraped res: 1 new job(job4) and 1 old job(job3)
    scraped_jobs = [
        {
            "job_title": "job3",
            "company_name": "company3",
            "job_url": "url3",
            "location": "location3",
            "job_date": "date3",
            "job_description": "description3",
            "additional_info": "",
            "salary": "salary3",
            "is_new": False,
        },
        {
            "job_title": "job4",
            "company_name": "company4",
            "job_url": "url4",
            "location": "location4",
            "job_date": "date4",
            "job_description": "description4",
            "additional_info": "",
            "salary": "salary4",
            "is_new": False,
        },
    ]
    mock_scrape.return_value = scraped_jobs

    email_data = await web_scraper(database.session)

    assert email_data["type"] == "web_scraper"
    # found 1 new job
    assert len(email_data["data"]) == 1
    assert email_data["data"][0]["site_name"] == SEEK
    assert len(email_data["data"][0]["jobs"]) == 1
    assert email_data["data"][0]["jobs"][0]["job_title"] == "job4"

    # check if old job listing(job1) is deleted
    job_listing = database.session.query(JobListing).filter_by(id=1).first()
    assert job_listing is None

    # check if the new job listing(job4) is added
    job_listing = database.session.query(JobListing).filter_by(id=4).first()
    assert job_listing is not None
    assert job_listing.is_new is True

    # check the notifications
    notifications = database.session.query(Notification).all()
    assert len(notifications) == 1

    # check if the last scraped date is updated
    scraped_site = database.session.query(ScrapedSite).filter_by(id=1).first()
    assert scraped_site.last_scrape_date == current_date

    # check that the write_to_log function was called
    mock_write_to_log.assert_called_once()


@pytest.mark.asyncio
@pytest.mark.usefixtures("setup_scraped_site_and_settings", "setup_job_listings_data")
@patch.object(SeekScraper, "scrape")
async def test_no_new_jobs_found(mock_scrape, database, mock_datetime, mock_write_to_log):
    # mock the current date
    current_date = datetime.strptime("2024-02-14", "%Y-%m-%d")
    mock_datetime.now.return_value = current_date

    # mock the return value of scrape_all_job_listings to be a list of dicts
    # scraped res: 1 old job(job2)
    scraped_jobs = [
        {
            "job_title": "job2",
            "company_name": "company2",
            "job_url": "url2",
            "location": "location2",
            "job_date": "date2",
            "job_description": "description2",
            "additional_info": "",
            "salary": "salary2",
            "is_new": False,
        }
    ]
    mock_scrape.return_value = scraped_jobs

    email_data = await web_scraper(database.session)

    assert email_data["type"] == "web_scraper"
    # no new jobs found
    assert len(email_data["data"]) == 0

    # check if old job listing(job1) is deleted
    job_listing = database.session.query(JobListing).filter_by(id=1).first()
    assert job_listing is None

    # check the notifications
    notifications = database.session.query(Notification).all()
    assert len(notifications) == 0

    # check that the last scraped date is updated
    scraped_site = database.session.query(ScrapedSite).filter_by(id=1).first()
    assert scraped_site.last_scrape_date == current_date

    # check that the write_to_log function was called
    mock_write_to_log.assert_called_once()
