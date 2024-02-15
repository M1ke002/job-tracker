import re
from time import time
import aiohttp
import asyncio
from bs4 import BeautifulSoup
from .constants import BASE_URL_GRAD_CONNECTION, BASE_URL_SEEK, GRAD_CONNECTION, SEEK
from .helper import add_page_number_to_Url


async def scrape_ausgrad_job_listings(soup: BeautifulSoup):
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
            location = (
                job.find("p", class_="ellipsis-text-paragraph location-name")
                .text.strip()
                .split(" ")[0]
            )

        job_description = job.find("p", class_="box-description-para")
        if job_description is not None:
            job_description = job_description.text.strip()

        job_link = job.find("a", class_="box-header-title")
        if job_link is not None:
            job_link = job_link.get("href")
            job_link = BASE_URL_GRAD_CONNECTION + job_link

        job_deadline = job.find("span", class_="closing-in closing-in-button")
        if job_deadline is not None:
            job_deadline = job_deadline.text.strip()
        else:
            job_deadline = "None"

        # jobSalary = job.find("div", class_="job-salary").text.strip()
        job_type = job.find("p", class_="ellipsis-text-paragraph")
        if job_type is not None:
            job_type = job_type.text.strip()

        # print('title: '+job_title)
        # print('company: '+company_name)
        # print('job type: '+job_type)
        # print('location: '+location)
        # print('desc: '+job_description)
        # print('link: '+job_link)
        # print('deadline: '+ job_deadline)
        # print("")

        if job_title and company_name and job_link:

            if job_link in jobs_dict:
                continue

            jobs_dict[job_link] = {
                "job_title": job_title,
                "company_name": company_name,
                "location": location,
                "job_date": job_deadline,
                "job_description": job_description,
                "additional_info": job_type,
                "salary": "",
                "job_url": job_link,
                "is_new": False,
            }

    jobs = list(jobs_dict.values())
    return jobs


async def scrape_seek_job_listings(soup: BeautifulSoup):
    jobs_dict = {}
    job_listings = soup.find_all("div", class_="_1wkzzau0 a1msqi6m")
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
            actual_job_link = BASE_URL_SEEK + job_link

        if job_title and company and actual_job_link:
            # add job to dict if not already in dict
            if actual_job_link in jobs_dict:
                continue

            jobs_dict[actual_job_link] = {
                "job_title": job_title,
                "company_name": company,
                "location": location,
                "job_date": job_listing_date,
                "job_description": job_description,
                "additional_info": "",
                "salary": job_salary,
                "job_url": actual_job_link,
                "is_new": False,
            }
            # print(f"Job Title: {job_title}\nCompany: {company}\nLocation : {location}\nPosted date: {jobListingDate}\nJob description: {jobDescription}\nJob salary: {jobSalary}\nLink : {actual_job_link}\n--------------------------------")

    jobs = list(jobs_dict.values())
    return jobs


async def fetch_and_parse_data(session, url, website_name):
    page = re.search(r"&page=(\d+)", url)

    if not page:
        print("Fetching page 1...")
    else:
        page = page.group(1)
        print(f"Fetching page {page}...")

    async with session.get(url) as response:
        html = await response.text()
        soup = BeautifulSoup(html, "html.parser")
        data = []

        if website_name == GRAD_CONNECTION:
            data = await scrape_ausgrad_job_listings(soup)
        elif website_name == SEEK:
            data = await scrape_seek_job_listings(soup)

        return data


async def scrape_all_job_listings(
    website_name: str, search_url: str, max_pages: int = 1
):
    start_time = time()

    jobs = []
    urls = [
        add_page_number_to_Url(search_url, page + 1, website_name)
        for page in range(max_pages)
    ]

    async with aiohttp.ClientSession() as session:
        tasks = [fetch_and_parse_data(session, url, website_name) for url in urls]
        result = await asyncio.gather(*tasks)
        for page in result:
            print(len(page))
            jobs.extend(page)

    # for page in range(max_pages):
    #     search_url_with_page = add_page_number_to_Url(search_url, page+1, website_name)
    #     print(search_url_with_page)
    #     response = requests.get(search_url_with_page)

    #     if response.status_code != 200:
    #         print(f'Error: {response.status_code}')
    #         return jobs

    #     soup = BeautifulSoup(response.content, 'html.parser')
    #     if (website_name == GRAD_CONNECTION):
    #         jobs.extend(scrape_ausgrad_job_listings(soup))
    #     elif (website_name == SEEK):
    #         jobs.extend(scrape_seek_job_listings(soup))

    #     print(f'=======================================End of page {page+1}=======================================')
    # print(f'jobs length: {len(jobs)}')

    time_difference = time() - start_time
    print("Scraping time: %.2f seconds." % time_difference)
    return jobs


#TODO: use class for each website (SEEK, GRAD_CONNECTION) instead of multiple functions in multiple files
#each class stays in 1 file, will have a method to scrape job listings, a url builder method, base url attribute
