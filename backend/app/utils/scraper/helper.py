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
            #both are dicts
            if (scrapedJob['job_title'] == oldJob['job_title'] and scrapedJob['company_name'] == oldJob['company_name'] and scrapedJob['job_url'] == oldJob['job_url']):
                isNew = False
                break
        if (isNew):
            scrapedJob['is_new'] = True
            newJobs.append(scrapedJob)

    return newJobs

