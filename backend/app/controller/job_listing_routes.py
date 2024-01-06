from flask import Blueprint

job_listing_routes = Blueprint('job_listing_routes', __name__)

#home route
@job_listing_routes.route('', methods=['GET'])
#view function
def hello_world():
    return 'get all job listings'