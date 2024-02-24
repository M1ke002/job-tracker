from abc import ABC, abstractmethod
from dataclasses import dataclass
from bs4 import BeautifulSoup
import aiohttp
import asyncio
from time import time
from app.model import ScrapedSiteSettings
import re


@dataclass
class ScrapeResult:
    job_title: str
    company_name: str
    location: str
    job_date: str
    job_description: str
    additional_info: str
    salary: str
    job_url: str
    is_new: bool

    def to_dict(self):
        return {
            "job_title": self.job_title,
            "company_name": self.company_name,
            "location": self.location,
            "job_date": self.job_date,
            "job_description": self.job_description,
            "additional_info": self.additional_info,
            "salary": self.salary,
            "job_url": self.job_url,
            "is_new": self.is_new,
        }


class BaseScraper(ABC):
    def __init__(
        self,
        website_name: str,
        base_url: str,
        scraped_site_settings: ScrapedSiteSettings,
    ):
        self.website_name = website_name
        self.base_url = base_url
        self.scraped_site_settings = scraped_site_settings
        self.use_selenium = False

    @abstractmethod
    def build_url() -> str:
        raise NotImplementedError("build_url method not implemented!")

    @abstractmethod
    # TODO: also add driver for selenium as input?
    async def parse_job_fields(self, soup: BeautifulSoup) -> list[ScrapeResult]:
        raise NotImplementedError("parse_job_fields method not implemented!")

    async def fetch_with_aiohttp(self, session, url: str) -> list[ScrapeResult]:
        page = re.search(r"&page=(\d+)", url)
        if not page:
            print("Fetching page 1...")
        else:
            page = page.group(1)
            print(f"Fetching page {page}...")

        async with session.get(url) as response:
            html = await response.text()
            soup = BeautifulSoup(html, "html.parser")
            return await self.parse_job_fields(soup)

    async def fetch_with_selenium(self, url: str) -> list[ScrapeResult]:
        pass

    async def fetch_and_parse_data(self, urls: list[str]) -> list[ScrapeResult]:
        if not self.use_selenium:
            jobs = []
            async with aiohttp.ClientSession() as session:
                tasks = [self.fetch_with_aiohttp(session, url) for url in urls]
                result = await asyncio.gather(*tasks)
                for page in result:
                    jobs.extend(page)
                return jobs
        else:
            # handle fetching with selenium
            pass

    # main method which will be called to scrape the site
    async def scrape(self) -> list[ScrapeResult]:
        start_time = time()

        # create search url
        search_url = self.build_url()

        urls = [
            self.add_page_number_to_url(search_url, page + 1) for page in range(self.scraped_site_settings.max_pages_to_scrape)
        ]
        print(urls)

        jobs = await self.fetch_and_parse_data(urls)
        jobs = [job.to_dict() for job in jobs]

        time_difference = time() - start_time
        print("Scraping time: %.2f seconds." % time_difference)
        return jobs

    def add_page_number_to_url(self, url: str, page: int) -> str:
        if page == 1:
            return url
        return url + f"&page={page}"
