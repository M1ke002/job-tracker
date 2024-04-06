from app.model import db, Notification
from sqlalchemy.orm.session import Session
from datetime import datetime


def get_all_notifications(limit, page):
    # notifications = Notification.query.order_by(Notification.created_at.desc()).limit(limit).all()
    notifications = Notification.query.order_by(
        Notification.created_at.desc(),
        Notification.id.desc(),
    ).paginate(page=page, per_page=limit, error_out=False)

    if notifications is None:
        return None

    # check if there are more pages
    has_next = notifications.has_next

    return [notification.to_dict() for notification in notifications], has_next


def get_unread_notifications():
    notifications = Notification.query.filter_by(is_read=False).all()
    return [notification.to_dict() for notification in notifications]


def set_notifications_to_read(unread_notifications):
    # input is a list of dictionaries
    for notification in unread_notifications:
        notification = Notification.query.get(notification["id"])
        notification.is_read = True

    db.session.commit()
    return "Set notifications to read successfully"


def create_notification_in_db(
    session: Session,
    message: str,
    created_at: datetime = datetime.now(),
):
    notification = Notification(
        message=message,
        is_read=False,
        created_at=created_at,
    )
    session.add(notification)
    session.commit()

    return notification


def delete_notification(notification_id):
    notification = Notification.query.get(notification_id)
    if notification is None:
        return None
    db.session.delete(notification)
    db.session.commit()
    return "Deleted notification successfully"


def delete_old_notifications_in_db(session: Session, cutoff_date: datetime):
    query = session.query(Notification).filter(Notification.created_at < cutoff_date)
    query.delete()
    session.commit()
