from flask import Blueprint

application_stage_routes = Blueprint('application_stage_routes', __name__)

# get all application stages
@application_stage_routes.route('', methods=['GET'])
def get_all_application_stages():
    return 'get all application stages'

# create an application stage
@application_stage_routes.route('', methods=['POST'])
def create_application_stage():
    return 'create an application stage'

# edit an application stage
@application_stage_routes.route('/<int:application_stage_id>', methods=['PUT'])
def edit_application_stage(application_stage_id):
    return 'edit an application stage'

# delete an application stage
@application_stage_routes.route('/<int:application_stage_id>', methods=['DELETE'])
def delete_application_stage(application_stage_id):
    return 'delete an application stage'