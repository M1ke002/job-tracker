from flask import Blueprint, request, jsonify

from app.service.scraped_site_service import get_all_scraped_sites
from app.service.scraped_site_service import get_scraped_site
from app.service.scraped_site_service import scrape_site

scraped_site_routes = Blueprint('scraped_site_routes', __name__)

# get all scraped sites
@scraped_site_routes.route('', methods=['GET'])
def handle_get_all_scraped_sites():
    scrapedSites = get_all_scraped_sites()
    return jsonify(scrapedSites), 200

# get a scraped site
@scraped_site_routes.route('/<int:scraped_site_id>', methods=['GET'])
def handle_get_scraped_site(scraped_site_id):
    scrapedSite = get_scraped_site(scraped_site_id)
    if scrapedSite is None:
        return jsonify({}), 404
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
    updated_scraped_site = await scrape_site(scraped_site_id)
    if updated_scraped_site is None:
        return jsonify({'error': 'Something wrong while scraping site'}), 400
    return jsonify(updated_scraped_site), 200
