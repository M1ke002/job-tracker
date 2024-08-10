import os
import sys

# print the system path
# append the path to the 'backend' folder to the system path
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "..", ".."))

import asyncio
from app.utils.scrapers.base_scraper import BaseScraper, ScrapeResult
from bs4 import BeautifulSoup
from app.model import ScrapedSiteSettings

SEEK = "Seek"
BASE_URL_SEEK = "https://www.seek.com.au"


class SeekScraper(BaseScraper):
    def __init__(self, scraped_site_settings: ScrapedSiteSettings):
        website_name = SEEK
        base_url = BASE_URL_SEEK
        super().__init__(
            website_name=website_name,
            base_url=base_url,
            scraped_site_settings=scraped_site_settings,
        )

    async def parse_job_fields(self, soup: BeautifulSoup) -> list[ScrapeResult]:
        jobs_dict = {}
        job_listings = []
        parent_div = soup.find("div", {"data-automation": "searchResults"})

        if parent_div:
            # job_listings = soup.find_all("div", class_="_4603vi0 _9l8a1v6m")
            job_listings = parent_div.find_all("article", {"data-automation": "normalJob"})
        print(f"Job Listings: {len(job_listings)}")

        for job in job_listings:
            # job_title_element = job.find('h3', class_='_1wkzzau0 a1msqi4y lnocuo0 lnocuol _1d0g9qk4 lnocuov lnocuo21')
            job_title = None
            job_title_element = job.find(attrs={"data-automation": "jobTitle"})
            if job_title_element:
                job_title = job_title_element.text.strip()

            company = job.find(attrs={"data-automation": "jobCompany"})
            if company:
                company = company.text.strip()

            location = job.find(attrs={"data-automation": "jobLocation"})
            if location:
                location = location.text.strip()

            job_listing_date = job.find(attrs={"data-automation": "jobListingDate"})
            if job_listing_date:
                job_listing_date = job_listing_date.text.strip()

            job_description = job.find(attrs={"data-automation": "jobShortDescription"})
            if job_description:
                job_description = job_description.text.strip()

            job_salary = job.find(attrs={"data-automation": "jobSalary"})
            if job_salary:
                # get inner span
                job_salary = job_salary.find("span").text.strip()

            link = job.find("a")
            actual_job_link = None
            if link:
                # Access the 'href' attribute value
                job_link = link.get("href")
                actual_job_link = self.base_url + job_link

            if job_title and company and actual_job_link:
                # add job to dict if not already in dict
                if actual_job_link in jobs_dict:
                    continue

                jobs_dict[actual_job_link] = ScrapeResult(
                    job_title=job_title,
                    company_name=company,
                    location=location,
                    job_date=job_listing_date,
                    job_description=job_description,
                    additional_info="",
                    salary=job_salary,
                    job_url=actual_job_link,
                    is_new=False,
                )

        jobs = list(jobs_dict.values())
        return jobs

    def build_url(self) -> str:
        """
        keyword: string. ex: "software engineer"
        job_type: string. ex: "full time / part time". default: "all"
        classification: string. ex: "information-communication-technology". default: "information-communication-technology"
        location: string. ex: "All Australia / All Sydney NSW / All Melbourne VIC". default: ""
        """

        keyword = self.scraped_site_settings.search_keyword
        job_type = self.scraped_site_settings.job_type
        classification = self.scraped_site_settings.classification
        location = self.scraped_site_settings.location

        url = self.base_url + "/"

        if keyword != "":
            url += keyword.replace(" ", "-") + "-jobs"
        else:
            url += "jobs"

        if classification == "":
            classification = "information-communication-technology"
        url += "-in-" + classification.lower().replace(" ", "-")

        if location != "":
            url += "/in-" + location.replace(" ", "-")

        if job_type == "":
            job_type = "all"
        if job_type != "all":
            url += "/" + job_type.lower().replace(" ", "-")

        url += "?sortmode=ListedDate"
        return url


async def main():
    scraped_site_settings = ScrapedSiteSettings(
        search_keyword="",
        job_type="",
        classification="",
        location="All Australia",
        max_pages_to_scrape=3,
    )
    scraper = SeekScraper(scraped_site_settings)
    jobs = await scraper.scrape()
    print(jobs, len(jobs))


if __name__ == "__main__":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
