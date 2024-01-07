from flask import Blueprint

saved_job_routes = Blueprint('saved_job_routes', __name__)

#get all saved jobs
@saved_job_routes.route('', methods=['GET'])
def get_all_saved_jobs():
    return 'get all saved jobs'

#get a saved job
@saved_job_routes.route('/<int:saved_job_id>', methods=['GET'])
def get_saved_job(saved_job_id):
    return 'get a saved job'

#create a saved job
@saved_job_routes.route('', methods=['POST'])
def create_saved_job():
    return 'create a saved job'

#edit a saved job
@saved_job_routes.route('/<int:saved_job_id>', methods=['PUT'])
def edit_saved_job(saved_job_id):
    return 'edit a saved job'

#delete a saved job
@saved_job_routes.route('/<int:saved_job_id>', methods=['DELETE'])
def delete_saved_job(saved_job_id):
    return 'delete a saved job'
    