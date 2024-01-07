from flask import Blueprint

task_routes = Blueprint('task_routes', __name__)

# get all tasks
@task_routes.route('', methods=['GET'])
def get_all_tasks():
    return 'get all tasks'

# create a task
@task_routes.route('', methods=['POST'])
def create_task():
    return 'create a task'

# edit a task
@task_routes.route('/<int:task_id>', methods=['PUT'])
def edit_task(task_id):
    return 'edit a task'

# delete a task
@task_routes.route('/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    return 'delete a task'

