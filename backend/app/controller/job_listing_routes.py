from flask import Blueprint, jsonify, request

from app.service.job_listing_service import get_all_job_listings
from app.service.job_listing_service import search_job_listings

job_listing_routes = Blueprint('job_listing_routes', __name__)

# get all job listings for a site
#sample request: http://localhost:5000/api/job-listings/2?page=1&per_page=30
@job_listing_routes.route('/<int:scraped_site_id>', methods=['GET'])
def handle_get_all_job_listings(scraped_site_id):
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=30, type=int)
    job_listings = get_all_job_listings(scraped_site_id, page, per_page)
    return jsonify(job_listings), 200

# search job listings for a site
#sample request: http://localhost:5000/api/job-listings/2/search?query=python&page=1&per_page=30
@job_listing_routes.route('/<int:scraped_site_id>/search', methods=['GET'])
def handle_search_job_listings(scraped_site_id):
    query = request.args.get('query', type=str)
    if not query:
        return jsonify({'error': 'query parameter is required'}), 400
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=30, type=int)
    job_listings = search_job_listings(scraped_site_id, query, page, per_page)
    return jsonify(job_listings), 200