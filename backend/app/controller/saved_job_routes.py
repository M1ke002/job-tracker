from flask import Blueprint, jsonify, request

from app.service.saved_job_service import get_all_saved_jobs
from app.service.saved_job_service import get_saved_job
from app.service.saved_job_service import delete_saved_job
from app.service.saved_job_service import create_saved_job
from app.service.saved_job_service import edit_saved_job
from app.service.saved_job_service import update_job_stage
from app.service.saved_job_service import update_job_order
from app.service.saved_job_service import remove_job_from_stage
from app.service.saved_job_service import edit_saved_job_notes
from app.service.saved_job_service import edit_saved_job_description
from app.service.saved_job_service import is_similar_job_exists

saved_job_routes = Blueprint("saved_job_routes", __name__)


# get all saved jobs
@saved_job_routes.route("", methods=["GET"])
def handle_get_all_saved_jobs():
    saved_jobs = get_all_saved_jobs()
    return jsonify(saved_jobs), 200


# get a saved job
@saved_job_routes.route("/<int:saved_job_id>", methods=["GET"])
def handle_get_saved_job(saved_job_id):
    saved_job = get_saved_job(saved_job_id)
    if saved_job is None:
        return jsonify({}), 404
    return jsonify(saved_job), 200


# create a saved job
@saved_job_routes.route("", methods=["POST"])
def handle_create_saved_job():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    job_title = data.get("jobTitle")
    company_name = data.get("companyName")
    job_url = data.get("jobUrl")

    if not job_title or not company_name or not job_url:
        return jsonify({"error": "Missing required fields"}), 400

    if is_similar_job_exists(job_title, company_name, job_url):
        return jsonify({"error": "Similar job already exists"}), 400

    job = create_saved_job(data)
    if job is None:
        return jsonify({"error": "Cannot save job"}), 400
    return jsonify(job), 200


# edit a saved job
@saved_job_routes.route("/<int:saved_job_id>", methods=["PUT"])
def handle_edit_saved_job(saved_job_id):
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    job_title = data.get("jobTitle")
    company_name = data.get("companyName")
    job_url = data.get("jobUrl")

    if not job_title or not company_name or not job_url:
        return jsonify({"error": "Missing required fields"}), 400

    if is_similar_job_exists(job_title, company_name, job_url, saved_job_id):
        return jsonify({"error": "Similar job already exists"}), 400

    job = edit_saved_job(saved_job_id, data)
    if job is None:
        return jsonify({"error": "Cannot edit job"}), 400
    return jsonify(job), 200


# edit a saved job's stage
@saved_job_routes.route("/<int:saved_job_id>/stage", methods=["PUT"])
def handle_edit_saved_job_stage(saved_job_id):
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    stage_id = data.get("stageId")
    if not stage_id:
        return jsonify({"error": "No stage id provided"}), 400

    job = update_job_stage(saved_job_id, stage_id)
    if job is None:
        return jsonify({"error": "Cannot update job stage"}), 400
    return jsonify(job), 200


# update job order
@saved_job_routes.route("/reorder-jobs", methods=["PUT"])
def handle_update_job_order():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    job_positions = data.get("jobPositions")
    if not job_positions:
        return jsonify({"error": "No job positions provided"}), 400

    res = update_job_order(job_positions)
    if res is None:
        return jsonify({"error": "Cannot update job order"}), 400

    return jsonify(res), 200


# remove job from stage
@saved_job_routes.route("/<int:saved_job_id>/remove-stage", methods=["PUT"])
def handle_remove_job_from_stage(saved_job_id):
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    job_positions = data.get("jobPositions")
    if not job_positions:
        return jsonify({"error": "No job positions provided"}), 400

    res = remove_job_from_stage(saved_job_id, job_positions)
    if res is None:
        return jsonify({"error": "Cannot remove job from stage"}), 400

    return jsonify(res), 200


# update notes for a saved job
@saved_job_routes.route("/<int:saved_job_id>/notes", methods=["PUT"])
def handle_update_saved_job_notes(saved_job_id):
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    notes = data.get("notes")
    if notes != "" and not notes:
        return jsonify({"error": "No notes provided"}), 400

    job = edit_saved_job_notes(saved_job_id, notes)
    if job is None:
        return jsonify({"error": "Cannot update job notes"}), 400
    return jsonify(job), 200


# update job description for a saved job
@saved_job_routes.route("/<int:saved_job_id>/job-description", methods=["PUT"])
def handle_update_saved_job_description(saved_job_id):
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    job_description = data.get("jobDescription")
    if job_description != "" and not job_description:
        return jsonify({"error": "No description provided"}), 400

    job = edit_saved_job_description(saved_job_id, job_description)
    if job is None:
        return jsonify({"error": "Cannot update job description"}), 400
    return jsonify(job), 200


# delete a saved job
@saved_job_routes.route("/<int:saved_job_id>", methods=["DELETE"])
def handle_delete_saved_job(saved_job_id):
    message = delete_saved_job(saved_job_id)
    if message is None:
        return jsonify({}), 404
    return jsonify(message), 200
