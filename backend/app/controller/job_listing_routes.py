from flask import Blueprint, jsonify, request

from app.service.job_listing_service import get_all_job_listings

job_listing_routes = Blueprint('job_listing_routes', __name__)

# get all job listings for a site
#sample request: http://localhost:5000/api/job-listings/2?page=1&per_page=30
@job_listing_routes.route('/<int:scraped_site_id>', methods=['GET'])
def handle_get_all_job_listings(scraped_site_id):
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=30, type=int)
    job_listings = get_all_job_listings(scraped_site_id, page, per_page)
    return jsonify(job_listings), 200