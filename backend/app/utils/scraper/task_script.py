#script used to run the scraper every day and update the database
# from ...config import database_config
import pymysql
from .helper import findNewJobListings
from .scrape import getAllJobListings

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

def clearAndInsertJobListings(connection, cursor, jobs):
    # clear all old job listings
    query = f"DELETE FROM job_listings"
    cursor.execute(query)
    connection.commit()

    # insert new job listings
    for job in jobs:
        query = f"INSERT INTO job_listings (job_title, company, location, job_listing_date, job_description, job_salary, link, scraped_site_id) VALUES ('{job['job_title']}', '{job['company']}', '{job['location']}', '{job['jobListingDate']}', '{job['jobDescription']}', '{job['jobSalary']}', '{job['link']}', 1)"
        cursor.execute(query)
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
        # get all job listings from scraped site
        #the attributes in getAllJobListings are currently hardcoded for testing purposes
        scraped_jobs = getAllJobListings('ausgrad', 'https://au.gradconnection.com/internships/sydney/?title=Software+Engineer&ordering=-recent_job_created', 3)

        # get all job listings from db
        old_jobs = fetchAllJobListings(connection, cursor, 1)

        # find new job listings
        new_jobs = findNewJobListings(old_jobs, scraped_jobs)

        # clear all old job listings and insert new job listings
        # TODO: for each new_job found, set is_new to true in scraped_jobs array
        clearAndInsertJobListings(connection, cursor, scraped_jobs)

    cursor.close()
    connection.close()