from flask import Blueprint

scraped_site_routes = Blueprint('scraped_site_routes', __name__)

# get all scraped sites
@scraped_site_routes.route('', methods=['GET'])
def get_all_scraped_sites():
    return 'get all scraped sites'

# get a scraped site
@scraped_site_routes.route('/<int:scraped_site_id>', methods=['GET'])
def get_scraped_site(scraped_site_id):
    return 'get a scraped site'

# edit a scraped site
@scraped_site_routes.route('/<int:scraped_site_id>', methods=['PUT'])
def edit_scraped_site(scraped_site_id):
    return 'edit a scraped site'

# scrape a site
@scraped_site_routes.route('/<int:scraped_site_id>/scrape', methods=['POST'])
def scrape_site(scraped_site_id):
    # call fn getAllJobListings to scrape newest job listings
    # compare scraped job listings with existing job listings in db
    # find new job listings
    # update db with scraped job listings
    return 'scrape a site'
