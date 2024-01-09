from flask import Blueprint, jsonify, request

from app.service.saved_job_service import get_all_saved_jobs
from app.service.saved_job_service import get_saved_job
from app.service.saved_job_service import delete_saved_job
from app.service.saved_job_service import create_saved_job

saved_job_routes = Blueprint('saved_job_routes', __name__)

#get all saved jobs
@saved_job_routes.route('', methods=['GET'])
def handle_get_all_saved_jobs():
    saved_jobs = get_all_saved_jobs()
    return jsonify(saved_jobs), 200

#get a saved job
@saved_job_routes.route('/<int:saved_job_id>', methods=['GET'])
def handle_get_saved_job(saved_job_id):
    saved_job = get_saved_job(saved_job_id)
    if saved_job is None:
        return jsonify({}), 404
    return jsonify(saved_job), 200

#create a saved job
@saved_job_routes.route('', methods=['POST'])
def handle_create_saved_job():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    job = create_saved_job(data)
    if job is None:
        return jsonify({'error': 'Cannot save job'}), 400
    return jsonify(job), 200

#edit a saved job
@saved_job_routes.route('/<int:saved_job_id>', methods=['PUT'])
def handle_edit_saved_job(saved_job_id):
    return 'edit a saved job'

#delete a saved job
@saved_job_routes.route('/<int:saved_job_id>', methods=['DELETE'])
def handle_delete_saved_job(saved_job_id):
    saved_job = delete_saved_job(saved_job_id)
    if saved_job is None:
        return jsonify({}), 404
    return jsonify(saved_job), 200