from datetime import datetime, timezone
import sqlalchemy as sa
import sqlalchemy.orm as so
from .db import db

class Notification(db.Model):
    __tablename__ = "notifications"

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    scraped_site_id: so.Mapped[int] = so.mapped_column(sa.Integer, sa.ForeignKey('scraped_sites.id'))
    message: so.Mapped[str] = so.mapped_column(sa.String(1000))
    created_at: so.Mapped[datetime] = so.mapped_column(
        default=lambda: datetime.now(timezone.utc))
    is_read: so.Mapped[bool] = so.mapped_column(sa.Boolean)

    def __repr__(self) -> str:
        return f"<Notification {self.message}>"