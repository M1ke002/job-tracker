from datetime import datetime, timedelta
from sqlalchemy.orm.session import Session
from app.utils.utils import utc_to_sydney_time
from app.service.notification_service import delete_old_notifications_in_db


async def delete_old_notifications(session: Session):
    # delete all old notifications where created_at is older than 30 days
    cutoff_date = utc_to_sydney_time(datetime.now()) - timedelta(days=30)
    delete_old_notifications_in_db(session, cutoff_date)
    return "Old notifications deleted successfully!"