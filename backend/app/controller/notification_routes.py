from flask import Blueprint, jsonify, request

from app.service.notification_service import get_all_notifications
from app.service.notification_service import delete_notification
from app.service.notification_service import set_notifications_to_read

notification_routes = Blueprint('notification_routes', __name__)

# get all notifications
#sample request: http://localhost:5000/api/notifications?limit=30
@notification_routes.route('', methods=['GET'])
def handle_get_all_notifications():
    # get the limit from the query string
    limit = request.args.get('limit', default=30, type=int)
    notifications = get_all_notifications(limit)
    return jsonify(notifications), 200

#set all notiications to read
@notification_routes.route('/read', methods=['PUT'])
def handle_set_notifications_to_read():
    notifications = set_notifications_to_read()
    return jsonify(notifications), 200

# delete a notification
@notification_routes.route('/<int:notification_id>', methods=['DELETE'])
def handle_delete_notification(notification_id):
    message = delete_notification(notification_id)
    if message is None:
        return jsonify({}), 404
    return jsonify(message), 200
