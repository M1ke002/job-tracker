from flask import Blueprint, jsonify, request

from app.service.job_listing_service import get_all_job_listings

job_listing_routes = Blueprint('job_listing_routes', __name__)

# get all job listings for a site
@job_listing_routes.route('/<int:scraped_site_id>', methods=['GET'])
def handle_get_all_job_listings(scraped_site_id):
    job_listings = get_all_job_listings(scraped_site_id)
    return jsonify(job_listings), 200