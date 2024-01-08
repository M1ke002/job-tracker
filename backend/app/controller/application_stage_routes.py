from flask import Blueprint, request, jsonify

from app.service.application_stage_service import get_all_application_stages
from app.service.application_stage_service import delete_application_stage


application_stage_routes = Blueprint('application_stage_routes', __name__)

# get all application stages
@application_stage_routes.route('', methods=['GET'])
def handle_get_all_application_stages():
    application_stages = get_all_application_stages()
    return jsonify(application_stages), 200

# create an application stage
@application_stage_routes.route('', methods=['POST'])
def handle_create_application_stage():
    return 'create an application stage'

# edit an application stage
@application_stage_routes.route('/<int:application_stage_id>', methods=['PUT'])
def handle_edit_application_stage(application_stage_id):
    return 'edit an application stage'

# delete an application stage
@application_stage_routes.route('/<int:application_stage_id>', methods=['DELETE'])
def handle_delete_application_stage(application_stage_id):
    application_stage = delete_application_stage(application_stage_id)
    if application_stage is None:
        return jsonify({}), 404
    return jsonify(application_stage), 200