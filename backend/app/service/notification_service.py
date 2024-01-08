from app.model import db, Notification

def get_all_notifications():
    notifications = Notification.query.all()
    return [notification.to_dict() for notification in notifications]

def delete_notification(notification_id):
    notification = Notification.query.get(notification_id)
    if notification is None:
        return None
    db.session.delete(notification)
    db.session.commit()
    return notification.to_dict()
