from .constants import GRAD_CONNECTION, SEEK

def add_page_number_to_Url(url: str, page: int, website_name: str):
    if (page == 1): return url
    if (website_name == GRAD_CONNECTION):
        return url + f'&page={page}'
    elif (website_name == SEEK):
        return url + f'&page={page}'
    else:
        return url

#compare the newly scraped job listings with the existing job listings in the db
#compare by job title, company name, and job url
def find_new_job_listings(old_jobs, scraped_jobs):
    new_jobs = []

    #all jobs are new
    if (len(old_jobs) == 0): 
        for scraped_job in scraped_jobs:
            scraped_job['is_new'] = True
        return scraped_jobs
    
    for scraped_job in scraped_jobs:
        isNew = True
        for old_job in old_jobs:
            #both are dicts
            if (scraped_job['job_title'] == old_job['job_title'] and scraped_job['company_name'] == old_job['company_name'] and scraped_job['job_url'] == old_job['job_url']):
                isNew = False
                break
        if (isNew):
            scraped_job['is_new'] = True
            new_jobs.append(scraped_job)

    return new_jobs

