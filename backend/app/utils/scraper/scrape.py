import requests
from bs4 import BeautifulSoup
from .url_builder import ausgradUrlBuilder, seekUrlBuilder
from .constants import BASE_URL_AUS_GRAD, BASE_URL_SEEK
from .helper import addPageNumberToUrl

def getAusGradJobPostings(soup: BeautifulSoup):
    jobs_dict = {}
    jobListContainer = soup.find("div", class_="jobs-container")

    if (jobListContainer == None): return []
    job_listings = jobListContainer.find_all("div", class_="outer-container")

    for job in job_listings:
        jobTitle = job.find("h3")
        if (jobTitle != None): jobTitle = jobTitle.text.strip()

        companyName = job.find("p", class_="box-header-para")
        if (companyName != None): companyName = companyName.text.strip()

        location = job.find("div", class_="ellipsis-text-paragraph location-name")
        if (location != None): location = location.text.strip()
        else: location = job.find("p", class_="ellipsis-text-paragraph location-name").text.strip()

        jobDescription = job.find("p", class_="box-description-para")
        if (jobDescription != None): jobDescription = jobDescription.text.strip()

        jobLink = job.find("a", class_="box-header-title")
        if (jobLink != None): 
            jobLink = jobLink.get("href")
            jobLink = BASE_URL_AUS_GRAD + jobLink

        jobDeadline = job.find("span", class_="closing-in closing-in-button")
        if (jobDeadline != None):
            jobDeadline = jobDeadline.text.strip()
        else:
            jobDeadline = "None"

        # jobSalary = job.find("div", class_="job-salary").text.strip()
        jobType = job.find("p", class_="ellipsis-text-paragraph")
        if (jobType != None): jobType = jobType.text.strip()


        print('title: '+jobTitle)
        print('company: '+companyName)
        print('job type: '+jobType)
        print('location: '+location)
        print('desc: '+jobDescription)
        print('link: '+jobLink)
        print('deadline: '+ jobDeadline)
        # print(jobSalary)
        print("")
        
        if (jobTitle and companyName and jobLink):

            if (jobLink in jobs_dict):
                continue

            jobs_dict[jobLink] = {
                'job_title': jobTitle,
                'company': companyName,
                'location': location,
                'jobListingDate': jobDeadline,
                'jobDescription': jobDescription,
                'jobSalary': 'None',
                'link': jobLink
            }

    jobs = list(jobs_dict.values())
    return jobs

def getSeekJobPostings(soup: BeautifulSoup):
    jobs_dict = {}
    job_listings = soup.find_all('div', class_='_1wkzzau0 a1msqi6m')
    print(f'Job Listings: {len(job_listings)}')
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

        jobListingDate = job.find(attrs={"data-automation": "jobListingDate"})
        if jobListingDate:
            jobListingDate = jobListingDate.text.strip()
        
        jobDescription = job.find(attrs={"data-automation": "jobShortDescription"})
        if jobDescription:
            jobDescription = jobDescription.text.strip()

        jobSalary = job.find(attrs={"data-automation": "jobSalary"})
        if jobSalary:
            #get inner span
            jobSalary = jobSalary.find('span').text.strip()
        
        link = job.find('a')
        actual_job_link = None
        if link:
            # Access the 'href' attribute value
            job_link = link.get('href')
            actual_job_link = BASE_URL_SEEK + job_link

        if job_title and company and actual_job_link:
            #add job to dict if not already in dict
            if (actual_job_link in jobs_dict):
                continue

            jobs_dict[actual_job_link] = {
                'job_title': job_title,
                'company': company,
                'location': location,
                'jobListingDate': jobListingDate,
                'jobDescription': jobDescription,
                'jobSalary': jobSalary,
                'link': actual_job_link
            }
            # print(f"Job Title: {job_title}\nCompany: {company}\nLocation : {location}\nPosted date: {jobListingDate}\nJob description: {jobDescription}\nJob salary: {jobSalary}\nLink : {actual_job_link}\n--------------------------------")

    jobs = list(jobs_dict.values())
    return jobs

def getAllJobListings(
        website: str,
        search_url: str,
        max_pages: int = 1
    ):
    jobs = []

    for page in range(max_pages):
        search_url_with_page = addPageNumberToUrl(search_url, page+1, website)
        print(search_url_with_page)
        response = requests.get(search_url_with_page)

        if response.status_code != 200:
            print(f'Error: {response.status_code}')
            return jobs
        
        soup = BeautifulSoup(response.content, 'html.parser')
        if (website == 'Grad Connection'):
            jobs.extend(getAusGradJobPostings(soup))
        elif (website == 'Seek'):
            jobs.extend(getSeekJobPostings(soup))

        print(f'=======================================End of page {page+1}=======================================')
    print(f'jobs length: {len(jobs)}')
    return jobs

if __name__ == '__main__':
    search_url = ausgradUrlBuilder(keyword='Software Engineer', jobType='internships', discipline='engineering-software', location='sydney')
    # search_url = seekUrlBuilder(keyword='Software Engineer', classification='information-communication-technology', location='All Sydney NSW')
    print(search_url)
    # getAllJobListings('ausgrad', 'https://au.gradconnection.com/internships/sydney/?title=Software+Engineer&ordering=-recent_job_created', 3)
    jobs = getAllJobListings('Grad Connection', search_url, 1)

