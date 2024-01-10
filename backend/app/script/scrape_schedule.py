#script used to run the scraper every day and update the database
# from ...config import database_config
import os 
import sys
#print the system path
#append the path to the 'backend' folder to the system path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))
print(sys.path)

from datetime import datetime, timezone
import json
import pymysql
from app.utils.scraper.scrape import getAllJobListings
from app.utils.scraper.helper import findNewJobListings
from app.utils.scraper.constants import SEEK, GRAD_CONNECTION
from app.utils.scraper.url_builder import ausgradUrlBuilder, seekUrlBuilder
from app.script.utils import write_to_file

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

def clearAndInsertJobListings(connection, cursor, jobs, scraped_site_id):
    # clear all old job listings
    query = f"DELETE FROM job_listings WHERE scraped_site_id = {scraped_site_id}"
    cursor.execute(query)
    connection.commit()

    # insert new job listings
    for job in jobs:
        cursor.execute(
            "INSERT INTO job_listings (scraped_site_id, job_title, company_name, location, job_description, additional_info, salary, job_url, is_new, job_date) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (scraped_site_id, job['job_title'], job['company_name'], job['location'], job['job_description'], job['additional_info'], job['salary'], job['job_url'], job['is_new'], job['job_date'])
        )
    connection.commit()


if __name__ == '__main__':
    connection = connectDB()
    cursor = connection.cursor()

    # get all scraped sites settings
    scraped_sites = fetchAllScrapedSites(connection, cursor)

    if (scraped_sites == None):
        print('No scraped sites found')
        cursor.close()
        connection.close()
        exit()

    for scraped_site in scraped_sites:
        print(scraped_site)
        # if (scraped_site[1] == SEEK): continue

        site_id = scraped_site[0]
        website_name = scraped_site[1]

        #get scraped site settings
        scraped_site_settings = fetchScrapeSiteSettings(connection, cursor, site_id)
        if (scraped_site_settings == None):
            print(f'No scraped site settings found for {website_name}')
            continue
        
        #get settings
        search_keyword = scraped_site_settings[6]
        location = scraped_site_settings[7]
        job_type = scraped_site_settings[8]
        work_type = scraped_site_settings[9]
        classification = scraped_site_settings[10]
        max_pages_to_scrape = scraped_site_settings[11]

        search_url = ''
        if (website_name == GRAD_CONNECTION):
            search_url = ausgradUrlBuilder(search_keyword, job_type, classification, location)
        elif (website_name == SEEK):
            search_url = seekUrlBuilder(search_keyword, work_type, classification, location)
        
        print(website_name, search_url)
        #currently test with only 1 scraped site
        # scraped_jobs = getAllJobListings(website_name, 'https://au.gradconnection.com/internships/sydney/?title=Software+Engineer&ordering=-recent_job_created', site_id)
        scraped_jobs = getAllJobListings(website_name, search_url, max_pages_to_scrape)

        # get all job listings from db
        old_jobs = fetchAllJobListings(connection, cursor, site_id)

        old_jobs_dict = []
        #old jobs is a list of tuples
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
            })

        # find new job listings
        [new_jobs, found_new_jobs] = findNewJobListings(old_jobs_dict, scraped_jobs)

        total_new_jobs_count = 0
        for job in new_jobs:
            if (job['is_new']):
                total_new_jobs_count += 1

        file_name = f'{website_name}.json'
        write_to_file(new_jobs, file_name)

        # write to a log.txt file
        with open('log.txt', 'a') as f:
            now = datetime.now()
            dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
            f.write(f"Scheduled job ran at {dt_string}. Found {total_new_jobs_count} new jobs for site: {website_name}\n")

        # clear all old job listings and insert new job listings
        # TODO: instead of clearing all old job listings, only clear old jobs that are older than 1 month
        clearAndInsertJobListings(connection, cursor, new_jobs, site_id)
    
        #update the last scraped date
        now = datetime.now()
        dt_string = now.strftime("%Y-%m-%d %H:%M:%S")
        query = f"UPDATE scraped_sites SET last_scrape_date = '{dt_string}' WHERE id = {site_id}"
        cursor.execute(query)
        connection.commit()

    cursor.close()
    connection.close()