def addPageNumberToUrl(url: str, page: int, website: str):
    if (page == 1): return url
    if (website == 'ausgrad'):
        return url + f'&page={page}'
    elif (website == 'seek'):
        return url + f'&page={page}'

#compare the newly scraped job listings with the existing job listings in the db
#compare by job title, company name
def findNewJobListings(oldJobs, newJobs):
    newJobListings = []

    if (oldJobs == None or len(oldJobs) == 0): 
        return newJobs
    
    for newJob in newJobs:
        isNew = True
        for oldJob in oldJobs:
            if (newJob['job_title'] == oldJob['job_title'] and newJob['company'] == oldJob['company']):
                isNew = False
                break
        if (isNew): newJobListings.append(newJob)

    return newJobListings

