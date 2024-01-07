from flask import Blueprint

job_listing_routes = Blueprint('job_listing_routes', __name__)

# get all job listings for a site
@job_listing_routes.route('/<int:scraped_site_id>', methods=['GET'])
def get_all_job_listings(scraped_site_id):
    return 'get all job listings'