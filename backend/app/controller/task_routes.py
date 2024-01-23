from flask import Blueprint, jsonify, request

from app.service.task_service import get_all_tasks
from app.service.task_service import delete_task
from app.service.task_service import create_task
from app.service.task_service import edit_task
from app.service.task_service import set_task_complete
from app.service.task_service import toggle_task_reminder

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
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    task = edit_task(task_id, data)
    if task is None:
        return jsonify({'error': 'Cannot edit task'}), 400
    return jsonify(task), 200

# set a task to complete/incomplete
@task_routes.route('/<int:task_id>/complete', methods=['PUT'])
def handle_set_task_complete(task_id):
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    task = set_task_complete(task_id, data)
    if task is None:
        return jsonify({'error': 'Cannot edit task'}), 400
    return jsonify(task), 200

# toggle a task's reminder
@task_routes.route('/<int:task_id>/reminder', methods=['PUT'])
def handle_toggle_task_reminder(task_id):
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    task = toggle_task_reminder(task_id, data)
    if task is None:
        return jsonify({'error': 'Cannot edit task'}), 400
    return jsonify(task), 200

# delete a task
@task_routes.route('/<int:task_id>', methods=['DELETE'])
def handle_delete_task(task_id):
    message = delete_task(task_id)
    if message is None:
        return jsonify({}), 404
    return jsonify(message), 200