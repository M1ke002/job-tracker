from flask import Blueprint, request, jsonify

from app.service.scraped_site_service import get_all_scraped_sites
from app.service.scraped_site_service import get_scraped_site
from app.service.scraped_site_service import scrape_site

from app.service.job_listing_service import get_all_job_listings_paginated
from app.service.job_listing_service import find_new_job_listings
from app.service.job_listing_service import create_job_listings_for_site

scraped_site_routes = Blueprint('scraped_site_routes', __name__)

# get all scraped sites
@scraped_site_routes.route('', methods=['GET'])
def handle_get_all_scraped_sites():
    #arr of dicts
    scrapedSites = get_all_scraped_sites()

    #get job listings for each scraped site
    for scrapedSite in scrapedSites:
        #query job listings, paginate by 30/page and sort by created_at date, return first page and total pages
        job_listings, total_pages, total_job_count = get_all_job_listings_paginated(scraped_site_id=scrapedSite['id'], page=1, per_page=30)

        scrapedSite['job_listings'] = job_listings
        scrapedSite['total_pages'] = total_pages
        scrapedSite['total_job_count'] = total_job_count

    return jsonify(scrapedSites), 200

# get a scraped site
@scraped_site_routes.route('/<int:scraped_site_id>', methods=['GET'])
def handle_get_scraped_site(scraped_site_id):
    scrapedSite = get_scraped_site(scraped_site_id)
    if scrapedSite is None:
        return jsonify({}), 404
    
    #query job listings, paginate by 30/page and sort by created_at date, return first page and total pages
    job_listings, total_pages, total_job_count = get_all_job_listings_paginated(scraped_site_id, page=1, per_page=30)
    scrapedSite['job_listings'] = job_listings
    scrapedSite['total_pages'] = total_pages
    scrapedSite['total_job_count'] = total_job_count

    return jsonify(scrapedSite), 200

# edit a scraped site
@scraped_site_routes.route('/<int:scraped_site_id>', methods=['PUT'])
def handle_edit_scraped_site(scraped_site_id):
    return 'edit a scraped site'

# scrape a site
@scraped_site_routes.route('/<int:scraped_site_id>/scrape', methods=['GET'])
async def handle_scrape_site(scraped_site_id):
    # call fn getAllJobListings to scrape newest job listings
    # compare scraped job listings with existing job listings in db
    # find new job listings
    # update db with scraped job listings

    scraped_jobs = await scrape_site(scraped_site_id)
    if scraped_jobs is None:
        return jsonify({'error': 'Something wrong while scraping site'}), 400
    
    new_jobs = find_new_job_listings(scraped_site_id, scraped_jobs)

    create_job_listings_for_site(scraped_site_id, new_jobs)

    #get new scraped site
    updated_scraped_site = get_scraped_site(scraped_site_id)
    if updated_scraped_site is None:
        return jsonify({'error': 'Cant find scraped site'}), 400
    
    #query job listings, paginate by 30/page and sort by created_at date, return first page and total pages
    job_listings, total_pages, total_job_count = get_all_job_listings_paginated(scraped_site_id, page=1, per_page=30)
    updated_scraped_site['job_listings'] = job_listings
    updated_scraped_site['total_pages'] = total_pages
    updated_scraped_site['total_job_count'] = total_job_count

    return jsonify(updated_scraped_site), 200