#script used to run the scraper every day and update the database
import os 

from dotenv import load_dotenv
load_dotenv()

from datetime import datetime, timezone, timedelta
import aiohttp
import asyncio
import json
import pymysql
from app.utils.scraper.scrape import scrapeAllJobListings
from app.utils.scraper.helper import findNewJobListings
from app.utils.scraper.constants import SEEK, GRAD_CONNECTION
from app.utils.scraper.url_builder import ausgradUrlBuilder, seekUrlBuilder
from app.utils.send_mail.send_mail import send_mail, create_subject_and_body, should_send_email
from app.scripts.utils import write_to_file

database_config = {
    "username": 'root',
    "password": 'root',
    "host": 'localhost',
    "port": '3306',
    "database": 'job_tracker'
}

def connectDB():
    connection = pymysql.connect(host=database_config['host'], user=database_config['username'], password=database_config['password'], db=database_config['database'])
    return connection 

def fetchScrapeSiteSettings(connection, cursor, scraped_site_id):
    query = f"SELECT * FROM scraped_site_settings WHERE id = {scraped_site_id}"
    cursor.execute(query)
    connection.commit()
    scraped_site = cursor.fetchone()
    return scraped_site

def fetchAllScrapedSites(connection, cursor):
    query = f"SELECT * FROM scraped_sites"
    cursor.execute(query)
    connection.commit()
    scraped_sites = cursor.fetchall()
    return scraped_sites

def fetchAllJobListings(connection, cursor, scraped_site_id):
    query = f"SELECT * FROM job_listings WHERE scraped_site_id = {scraped_site_id}"
    cursor.execute(query)
    connection.commit()
    job_listings = cursor.fetchall()
    return job_listings

#update the is_new field of the job listings to false
def updateJobListing(connection, cursor, jobs):
    for job in jobs:
        if (job['is_new'] == False): continue
        query = f"UPDATE job_listings SET is_new = 0 WHERE id = {job['id']}"
        cursor.execute(query)

    connection.commit()

#delete all old job listings where created_at is older than 3 days
def deleteOldJobListings(connection, cursor):
    cutoff_date = datetime.now() - timedelta(days=3)
    sql = "DELETE FROM job_listings WHERE created_at < %s"
    cursor.execute(sql, (cutoff_date,))
    connection.commit()

def addJobListings(connection, cursor, jobs, scraped_site_id):
    if (len(jobs) == 0): return
    # insert new job listings
    for job in jobs:
        cursor.execute(
            "INSERT INTO job_listings (scraped_site_id, job_title, company_name, location, job_description, additional_info, salary, job_url, is_new, job_date, created_at) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)",
            (scraped_site_id, job['job_title'], job['company_name'], job['location'], job['job_description'], job['additional_info'], job['salary'], job['job_url'], job['is_new'], job['job_date'])
        )
    connection.commit()

def createNotification(connection, cursor, scraped_site_id, website_name, new_jobs_count):
    cursor.execute(
        "INSERT INTO notifications (scraped_site_id, message, created_at, is_read) VALUES (%s, %s, CURRENT_TIMESTAMP, %s)",
        (scraped_site_id, f'Found {new_jobs_count} new jobs on {website_name}', 0)
    )
    connection.commit()

#main function
async def scrape_schedule(connection, cursor):
    email_data = {
        'type': 'scrape_schedule',
        'data': []
    }
    found_jobs_dict = {
        GRAD_CONNECTION: [],
        SEEK: []
    }

    #delete all old job listings where created_at is older than 1 week
    deleteOldJobListings(connection, cursor)

    # get all scraped sites settings
    scraped_sites = fetchAllScrapedSites(connection, cursor)

    if (scraped_sites == None):
        print('No scraped sites found')
        cursor.close()
        connection.close()
        exit()

    for scraped_site in scraped_sites:
        # print(scraped_site)
        # if (scraped_site[1] == SEEK): continue

        site_id = scraped_site[0]
        website_name = scraped_site[1]

        #get scraped site settings
        scraped_site_settings = fetchScrapeSiteSettings(connection, cursor, site_id)
        if (scraped_site_settings == None):
            print(f'No scraped site settings found for {website_name}')
            continue
        
        #get settings
        search_keyword = scraped_site_settings[4]
        location = scraped_site_settings[5]
        job_type = scraped_site_settings[6]
        classification = scraped_site_settings[7]
        max_pages_to_scrape = scraped_site_settings[8]
        scrape_frequency = scraped_site_settings[2]
        is_notify_email = scraped_site_settings[3]
        is_notify_on_website = scraped_site_settings[9]

        #if disabled scrape, continue
        if scrape_frequency == -1:
            continue

        search_url = ''
        if (website_name == GRAD_CONNECTION):
            search_url = ausgradUrlBuilder(search_keyword, job_type, classification, location)
        elif (website_name == SEEK):
            search_url = seekUrlBuilder(search_keyword, job_type, classification, location)
        
        print(website_name, search_url)
        # scraped_jobs = scrapeAllJobListings(website_name, 'https://au.gradconnection.com/internships/sydney/?title=Software+Engineer&ordering=-recent_job_created', site_id)
        scraped_jobs = await scrapeAllJobListings(website_name, search_url, max_pages_to_scrape)

        # get all job listings from db
        old_jobs = fetchAllJobListings(connection, cursor, site_id)

        old_jobs_dict = []
        #old jobs is a list of tuples -> need to convert to a list of dicts
        for job in old_jobs:
            old_jobs_dict.append({
                'id': job[0],
                'scraped_site_id': job[1],
                'job_title': job[2],
                'company_name': job[3],
                'location': job[4],
                'job_description': job[5],
                'additional_info': job[6],
                'salary': job[7],
                'job_url': job[8],
                'is_new': job[9] == 1,
                'job_date': job[10],
                'created_at': job[11]
            })

        # find new job listings
        new_jobs = findNewJobListings(old_jobs_dict, scraped_jobs)

        total_new_jobs_count = len(new_jobs)
        print(f'Found {total_new_jobs_count} new jobs for site: {website_name}')

        #add new jobs to the found_jobs_dict
        found_jobs_dict[website_name] = new_jobs

        # update the is_new field of the existing job listings to false
        updateJobListing(connection, cursor, old_jobs_dict)
        # insert new job listings
        addJobListings(connection, cursor, new_jobs, site_id)

        if (len(new_jobs) > 0 and bool(is_notify_on_website)):
            # create a notification
            createNotification(connection, cursor, site_id, website_name, total_new_jobs_count)

        if len(new_jobs) > 0 and bool(is_notify_email):
            email_data['data'].append({
                'site_name': website_name,
                'jobs': new_jobs
            })
    
        #update the last scraped date
        now = datetime.now()
        dt_string = now.strftime("%Y-%m-%d %H:%M:%S")
        query = f"UPDATE scraped_sites SET last_scrape_date = '{dt_string}' WHERE id = {site_id}"
        cursor.execute(query)
        connection.commit()

    # write to a log.txt file
    text = f"Scheduled job ran at {dt_string}. Found "
    for site_name, jobs in found_jobs_dict.items():
        text += f"{len(jobs)} new jobs for site: {site_name}, "

    #remove the last 2 characters, which are ', '
    text = text[:-2]
    text += '.'
    with open('log.txt', 'a') as f:
        now = datetime.now()
        dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
        f.write(text + '\n')

    return email_data

async def main():
    connection = connectDB()
    cursor = connection.cursor()

    found_jobs_dict = {
        GRAD_CONNECTION: [],
        SEEK: []
    }
    email_notification_settings = {
        GRAD_CONNECTION: False,
        SEEK: False
    }

    #delete all old job listings where created_at is older than 1 week
    deleteOldJobListings(connection, cursor)

    # get all scraped sites settings
    scraped_sites = fetchAllScrapedSites(connection, cursor)

    if (scraped_sites == None):
        print('No scraped sites found')
        cursor.close()
        connection.close()
        exit()

    for scraped_site in scraped_sites:
        # print(scraped_site)
        # if (scraped_site[1] == SEEK): continue

        site_id = scraped_site[0]
        website_name = scraped_site[1]

        #get scraped site settings
        scraped_site_settings = fetchScrapeSiteSettings(connection, cursor, site_id)
        if (scraped_site_settings == None):
            print(f'No scraped site settings found for {website_name}')
            continue
        
        #get settings
        search_keyword = scraped_site_settings[4]
        location = scraped_site_settings[5]
        job_type = scraped_site_settings[6]
        classification = scraped_site_settings[7]
        max_pages_to_scrape = scraped_site_settings[8]
        scrape_frequency = scraped_site_settings[2]
        is_notify_email = scraped_site_settings[3]
        is_notify_on_website = scraped_site_settings[9]

        #update the email_notification_settings dict
        email_notification_settings[website_name] = bool(is_notify_email)

        #if disabled scrape, continue
        if scrape_frequency == -1:
            continue

        search_url = ''
        if (website_name == GRAD_CONNECTION):
            search_url = ausgradUrlBuilder(search_keyword, job_type, classification, location)
        elif (website_name == SEEK):
            search_url = seekUrlBuilder(search_keyword, job_type, classification, location)
        
        print(website_name, search_url)
        # scraped_jobs = scrapeAllJobListings(website_name, 'https://au.gradconnection.com/internships/sydney/?title=Software+Engineer&ordering=-recent_job_created', site_id)
        scraped_jobs = await scrapeAllJobListings(website_name, search_url, max_pages_to_scrape)

        # get all job listings from db
        old_jobs = fetchAllJobListings(connection, cursor, site_id)

        old_jobs_dict = []
        #old jobs is a list of tuples -> need to convert to a list of dicts
        for job in old_jobs:
            old_jobs_dict.append({
                'id': job[0],
                'scraped_site_id': job[1],
                'job_title': job[2],
                'company_name': job[3],
                'location': job[4],
                'job_description': job[5],
                'additional_info': job[6],
                'salary': job[7],
                'job_url': job[8],
                'is_new': job[9] == 1,
                'job_date': job[10],
                'created_at': job[11]
            })

        # find new job listings
        new_jobs = findNewJobListings(old_jobs_dict, scraped_jobs)

        total_new_jobs_count = len(new_jobs)
        print(f'Found {total_new_jobs_count} new jobs for site: {website_name}')

        #add new jobs to the found_jobs_dict
        found_jobs_dict[website_name] = new_jobs

        # update the is_new field of the existing job listings to false
        updateJobListing(connection, cursor, old_jobs_dict)
        # insert new job listings
        addJobListings(connection, cursor, new_jobs, site_id)

        if (len(new_jobs) > 0 and bool(is_notify_on_website)):
            # create a notification
            createNotification(connection, cursor, site_id, website_name, total_new_jobs_count)
    
        #update the last scraped date
        now = datetime.now()
        dt_string = now.strftime("%Y-%m-%d %H:%M:%S")
        query = f"UPDATE scraped_sites SET last_scrape_date = '{dt_string}' WHERE id = {site_id}"
        cursor.execute(query)
        connection.commit()

    cursor.close()
    connection.close()

    # write to a log.txt file
    text = f"Scheduled job ran at {dt_string}. Found "
    for site_name, jobs in found_jobs_dict.items():
        text += f"{len(jobs)} new jobs for site: {site_name}, "

    #remove the last 2 characters, which are ', '
    text = text[:-2]
    text += '.'
    with open('log.txt', 'a') as f:
        now = datetime.now()
        dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
        f.write(text + '\n')


    #send email notification
    if (should_send_email(found_jobs_dict, email_notification_settings)):
        GMAIL_USERNAME = os.getenv('GMAIL_USERNAME')
        GMAIL_APP_PASSWORD = os.getenv('GMAIL_APP_PASSWORD')
        subject, body = create_subject_and_body(found_jobs_dict, email_notification_settings)
        send_mail(
            GMAIL_USERNAME,
            GMAIL_APP_PASSWORD,
            [GMAIL_USERNAME],
            subject,
            body
        )
        

if __name__ == '__main__':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())