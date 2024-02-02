from app.model import db, Notification

def get_all_notifications(limit, page):
    # notifications = Notification.query.order_by(Notification.created_at.desc()).limit(limit).all()
    notifications = Notification.query.order_by(Notification.created_at.desc()).paginate(page=page, per_page=limit, error_out=False)
    if notifications is None:
        return None
    
    #check if there are more pages
    has_next = notifications.has_next
    return [notification.to_dict() for notification in notifications], has_next

def set_notifications_to_read():
    notifications = Notification.query.filter_by(is_read=False).all()
    if len(notifications) == 0:
        return []
    for notification in notifications:
        notification.is_read = True
    db.session.commit()
    return [notification.to_dict() for notification in notifications]

def delete_notification(notification_id):
    notification = Notification.query.get(notification_id)
    if notification is None:
        return None
    db.session.delete(notification)
    db.session.commit()
    return "Deleted notification successfully"
