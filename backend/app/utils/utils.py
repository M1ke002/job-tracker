from datetime import timezone, timedelta, datetime
from dateutil import parser


def utc_to_vietnam_time(utc_time: datetime):
    return utc_time.astimezone(timezone(timedelta(hours=7)))


def utc_to_sydney_time(utc_time: datetime):
    return utc_time.astimezone(timezone(timedelta(hours=11)))


def get_current_utc_time():
    return datetime.now(timezone.utc)


def is_date_iso_format(date_string: str):
    print(f"testing: {date_string}")
    try:
        # parse the date string
        parsed_date = parser.isoparse(date_string)
        # Convert to UTC and return
        return parsed_date.astimezone(timezone.utc)
    except ValueError:
        print("Invalid isoformat string")
        return None


# compare the newly scraped job listings with the existing job listings in the db
# compare by job title, company name, and job url
def find_new_job_listings(old_jobs, scraped_jobs):
    new_jobs = []

    # all jobs are new
    if len(old_jobs) == 0:
        for scraped_job in scraped_jobs:
            scraped_job["is_new"] = True
        return scraped_jobs

    for scraped_job in scraped_jobs:
        isNew = True
        for old_job in old_jobs:
            # both are dicts
            if (
                scraped_job["job_title"] == old_job["job_title"]
                and scraped_job["company_name"] == old_job["company_name"]
                and scraped_job["job_url"] == old_job["job_url"]
            ):
                isNew = False
                break
        if isNew:
            scraped_job["is_new"] = True
            new_jobs.append(scraped_job)

    return new_jobs
