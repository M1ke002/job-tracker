from flask import Blueprint, jsonify, request

from app.service.task_service import get_all_tasks
from app.service.task_service import delete_task
from app.service.task_service import create_task

task_routes = Blueprint('task_routes', __name__)

# get all tasks
@task_routes.route('', methods=['GET'])
def handle_get_all_tasks():
    tasks = get_all_tasks()
    return jsonify(tasks), 200

# create a task
@task_routes.route('', methods=['POST'])
def handle_create_task():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    task = create_task(data)
    if task is None:
        return jsonify({'error': 'Cannot create task'}), 400
    return jsonify(task), 200

# edit a task
@task_routes.route('/<int:task_id>', methods=['PUT'])
def handle_edit_task(task_id):
    return 'edit a task'

# delete a task
@task_routes.route('/<int:task_id>', methods=['DELETE'])
def handle_delete_task(task_id):
    task = delete_task(task_id)
    if task is None:
        return jsonify({}), 404
    return jsonify(task), 200