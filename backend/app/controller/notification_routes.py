from flask import Blueprint

notification_routes = Blueprint('notification_routes', __name__)

# get all notifications
@notification_routes.route('', methods=['GET'])
def get_all_notifications():
    return 'get all notifications'

# delete a notification
@notification_routes.route('/<int:notification_id>', methods=['DELETE'])
def delete_notification(notification_id):
    return 'delete a notification'
