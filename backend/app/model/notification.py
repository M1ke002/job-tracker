from datetime import datetime
import sqlalchemy as sa
import sqlalchemy.orm as so
from .db import db


class Notification(db.Model):
    __tablename__ = "notifications"

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    message: so.Mapped[str] = so.mapped_column(sa.String(1000))
    created_at: so.Mapped[datetime] = so.mapped_column(default=lambda: datetime.now())
    is_read: so.Mapped[bool] = so.mapped_column(sa.Boolean)

    def __repr__(self) -> str:
        return f"<Notification {self.message}>"

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "message": self.message,
            "created_at": self.created_at,
            "is_read": self.is_read,
        }
