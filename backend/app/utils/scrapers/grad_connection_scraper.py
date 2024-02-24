import os
import sys

# print the system path
# append the path to the 'backend' folder to the system path
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "..", ".."))

import asyncio
from app.utils.scrapers.base_scraper import BaseScraper, ScrapeResult
from bs4 import BeautifulSoup
from app.model import ScrapedSiteSettings

GRAD_CONNECTION = "Grad Connection"
BASE_URL_GRAD_CONNECTION = "https://au.gradconnection.com"


class GradConnectionScraper(BaseScraper):
    def __init__(self, scraped_site_settings: ScrapedSiteSettings):
        website_name = GRAD_CONNECTION
        base_url = BASE_URL_GRAD_CONNECTION
        super().__init__(
            website_name=website_name,
            base_url=base_url,
            scraped_site_settings=scraped_site_settings,
        )

    async def parse_job_fields(self, soup: BeautifulSoup) -> list[ScrapeResult]:
        jobs_dict = {}
        job_list_container = soup.find("div", class_="jobs-container")

        if job_list_container is None:
            return []
        job_listings = job_list_container.find_all("div", class_="outer-container")

        for job in job_listings:
            job_title = job.find("h3")
            if job_title is not None:
                job_title = job_title.text.strip()

            company_name = job.find("p", class_="box-header-para")
            if company_name is not None:
                company_name = company_name.text.strip()

            location = job.find("div", class_="ellipsis-text-paragraph location-name")
            if location is not None:
                location = location.text.strip().split(" ")[0]
            else:
                location = job.find("p", class_="ellipsis-text-paragraph location-name").text.strip().split(" ")[0]

            job_description = job.find("p", class_="box-description-para")
            if job_description is not None:
                job_description = job_description.text.strip()

            job_link = job.find("a", class_="box-header-title")
            if job_link is not None:
                job_link = job_link.get("href")
                job_link = self.base_url + job_link

            job_deadline = job.find("span", class_="closing-in closing-in-button")
            if job_deadline is not None:
                job_deadline = job_deadline.text.strip()
            else:
                job_deadline = "None"

            # jobSalary = job.find("div", class_="job-salary").text.strip()
            job_type = job.find("p", class_="ellipsis-text-paragraph")
            if job_type is not None:
                job_type = job_type.text.strip()

            if job_title and company_name and job_link:
                if job_link in jobs_dict:
                    continue

                jobs_dict[job_link] = ScrapeResult(
                    job_title=job_title,
                    company_name=company_name,
                    location=location,
                    job_date=job_deadline,
                    job_description=job_description,
                    additional_info=job_type,
                    salary="",
                    job_url=job_link,
                    is_new=False,
                )

        jobs = list(jobs_dict.values())
        return jobs

    def build_url(self) -> str:
        """
        keyword: string. ex: "software engineer"
        job_type: string. ex: "internships / graduate jobs". default: "all" - all job types, displayed as (jobs)
        classification: string. ex: "engineering-software". default: "engineering-software"
        location: string. ex: "sydney". default: "australia"
        """

        keyword = self.scraped_site_settings.search_keyword
        job_type = self.scraped_site_settings.job_type
        classification = self.scraped_site_settings.classification
        location = self.scraped_site_settings.location

        url = self.base_url + "/"

        if job_type == "":
            job_type = "all"
        if job_type == "all":
            job_type = "jobs"
        url += job_type.replace(" ", "-") + "/"

        if classification == "":
            classification = "engineering-software"
        url += classification.replace(" ", "-") + "/"

        if location != "":
            url += location.lower() + "/"

        if keyword != "":
            url += "?title=" + keyword.replace(" ", "+")
        if keyword != "":
            url += "&"
        else:
            url += "?"

        url += "ordering=-recent_job_created"
        return url


async def main():
    scraped_site_settings = ScrapedSiteSettings(
        search_keyword="",
        job_type="internships",
        classification="computer-science",
        location="australia",
        max_pages_to_scrape=2,
    )
    scraper = GradConnectionScraper(scraped_site_settings)
    jobs = await scraper.scrape()
    print(jobs, len(jobs))


if __name__ == "__main__":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
