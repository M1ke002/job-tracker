from .constants import GRAD_CONNECTION, SEEK

def addPageNumberToUrl(url: str, page: int, website_name: str):
    if (page == 1): return url
    if (website_name == GRAD_CONNECTION):
        return url + f'&page={page}'
    elif (website_name == SEEK):
        return url + f'&page={page}'
    else:
        return url
    
def jobObjectToDict(job):
    return {
        'id': job.id,
        'scraped_site_id': job.scraped_site_id,
        'job_title': job.job_title,
        'company_name': job.company_name,
        'location': job.location,
        'job_description': job.job_description,
        'additional_info': job.additional_info,
        'salary': job.salary,
        'job_url': job.job_url,
        'job_date': job.job_date,
        'is_new': False,
        'created_at': job.created_at
    }

#compare the newly scraped job listings with the existing job listings in the db
#compare by job title, company name, and job url
def findNewJobListings(oldJobs, scrapedJobs):
    newJobs = []

    #all jobs are new
    if (len(oldJobs) == 0): 
        for scrapedJob in scrapedJobs:
            scrapedJob['is_new'] = True
        return scrapedJobs
    
    for scrapedJob in scrapedJobs:
        isNew = True
        for oldJob in oldJobs:
            #newJob is of type dict, oldJob is of type object
            if (scrapedJob['job_title'] == oldJob['job_title'] and scrapedJob['company_name'] == oldJob['company_name'] and scrapedJob['job_url'] == oldJob['job_url']):
                isNew = False
                break
        if (isNew):
            scrapedJob['is_new'] = True
            newJobs.append(scrapedJob)

    return newJobs

