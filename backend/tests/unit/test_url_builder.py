from app.utils.scrapers.grad_connection_scraper import (
    BASE_URL_GRAD_CONNECTION,
    GradConnectionScraper,
)
from app.utils.scrapers.seek_scraper import BASE_URL_SEEK, SeekScraper
from app.model import ScrapedSiteSettings
import pytest


def test_ausgrad_url_builder_default():
    scraped_site_settings = ScrapedSiteSettings(
        search_keyword="",
        job_type="",
        classification="",
        location="",
    )

    grad_connection_scraper = GradConnectionScraper(scraped_site_settings)
    url = grad_connection_scraper.build_url()
    expected_url = BASE_URL_GRAD_CONNECTION + "/jobs/engineering-software/?ordering=-recent_job_created"
    assert url == expected_url


@pytest.mark.parametrize(
    "keyword, jobType, classification, location, expected_url",
    [
        (
            "software engineer",
            "internships",
            "",
            "sydney",
            BASE_URL_GRAD_CONNECTION
            + "/internships/engineering-software/sydney/?title=software+engineer&ordering=-recent_job_created",
        ),
        (
            "",
            "",
            "computer-science",
            "",
            BASE_URL_GRAD_CONNECTION + "/jobs/computer-science/?ordering=-recent_job_created",
        ),
        (
            "software",
            "graduate jobs",
            "computer-science",
            "Sydney",
            BASE_URL_GRAD_CONNECTION + "/graduate-jobs/computer-science/sydney/?title=software&ordering=-recent_job_created",
        ),
    ],
)
def test_ausgrad_url_builder_with_parameters(keyword, jobType, classification, location, expected_url):
    scraped_site_settings = ScrapedSiteSettings(
        search_keyword=keyword,
        job_type=jobType,
        classification=classification,
        location=location,
    )

    grad_connection_scraper = GradConnectionScraper(scraped_site_settings)
    url = grad_connection_scraper.build_url()
    assert url == expected_url


def test_seek_url_builder_default():
    scraped_site_settings = ScrapedSiteSettings(
        search_keyword="",
        job_type="",
        classification="",
        location="",
    )

    seek_scraper = SeekScraper(scraped_site_settings)
    url = seek_scraper.build_url()
    expected_url = BASE_URL_SEEK + "/jobs-in-information-communication-technology?sortmode=ListedDate"
    assert url == expected_url


@pytest.mark.parametrize(
    "keyword, jobType, classification, location, expected_url",
    [
        (
            "software engineer",
            "full time",
            "",
            "All Australia",
            BASE_URL_SEEK
            + "/software-engineer-jobs-in-information-communication-technology/in-All-Australia/full-time?sortmode=ListedDate",
        ),
        (
            "",
            "",
            "computer-science",
            "",
            BASE_URL_SEEK + "/jobs-in-computer-science?sortmode=ListedDate",
        ),
        (
            "software",
            "part time",
            "computer-science",
            "All Sydney NSW",
            BASE_URL_SEEK + "/software-jobs-in-computer-science/in-All-Sydney-NSW/part-time?sortmode=ListedDate",
        ),
    ],
)
def test_seek_url_builder_with_parameters(keyword, jobType, classification, location, expected_url):
    scraped_site_settings = ScrapedSiteSettings(
        search_keyword=keyword,
        job_type=jobType,
        classification=classification,
        location=location,
    )

    seek_scraper = SeekScraper(scraped_site_settings)
    url = seek_scraper.build_url()
    assert url == expected_url
