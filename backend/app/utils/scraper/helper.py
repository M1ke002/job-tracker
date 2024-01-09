from .constants import GRAD_CONNECTION, SEEK

def addPageNumberToUrl(url: str, page: int, website_name: str):
    if (page == 1): return url
    if (website_name == GRAD_CONNECTION):
        return url + f'&page={page}'
    elif (website_name == SEEK):
        return url + f'&page={page}'
    else:
        return url

#compare the newly scraped job listings with the existing job listings in the db
#compare by job title, company name, and job url
def findNewJobListings(oldJobs, newJobs):
    found_new_jobs = False
    if (len(oldJobs) == 0): 
        for newJob in newJobs:
            newJob['is_new'] = True
        found_new_jobs = True
        return [newJobs, found_new_jobs]
    
    for newJob in newJobs:
        isNew = True
        for oldJob in oldJobs:
            #newJob is of type dict, oldJob is of type object
            if (newJob['job_title'] == oldJob.job_title and newJob['company_name'] == oldJob.company_name and newJob['job_url'] == oldJob.job_url):
                isNew = False
                break
        if (isNew):
            newJob['is_new'] = True
            found_new_jobs = True

    return [newJobs, found_new_jobs]

