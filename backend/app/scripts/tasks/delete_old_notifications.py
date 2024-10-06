from datetime import timedelta
from sqlalchemy.orm.session import Session
from app.utils.utils import get_current_utc_time
from app.service.notification_service import delete_old_notifications_in_db


async def delete_old_notifications(session: Session):
    # delete all old notifications where created_at is older than 30 days
    cutoff_date = get_current_utc_time() - timedelta(days=30)
    delete_old_notifications_in_db(session, cutoff_date)
    return "Old notifications deleted successfully!"
