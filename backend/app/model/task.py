from typing import Optional
import sqlalchemy as sa
import sqlalchemy.orm as so
from .db import db
from datetime import datetime


class Task(db.Model):
    __tablename__ = "tasks"

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    job_id: so.Mapped[int] = so.mapped_column(
        sa.Integer, sa.ForeignKey("saved_jobs.id")
    )
    task_name: so.Mapped[str] = so.mapped_column(sa.String(150))
    due_date: so.Mapped[Optional[datetime]] = so.mapped_column(
        sa.DateTime(timezone=True), nullable=True
    )
    is_completed: so.Mapped[bool] = so.mapped_column(sa.Boolean, default=False)
    is_reminder_enabled: so.Mapped[bool] = so.mapped_column(sa.Boolean, default=False)
    is_reminded: so.Mapped[bool] = so.mapped_column(sa.Boolean, default=False)
    # no of days before due date to send reminder
    reminder_date: so.Mapped[Optional[int]] = so.mapped_column(sa.Integer, default=1)
    is_notify_email: so.Mapped[bool] = so.mapped_column(sa.Boolean, default=False)
    is_notify_on_website: so.Mapped[bool] = so.mapped_column(sa.Boolean, default=True)

    def __repr__(self) -> str:
        return f"<Task {self.task_name} {self.due_date}>"

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "job_id": self.job_id,
            "task_name": self.task_name,
            "due_date": self.due_date,
            "is_completed": self.is_completed,
            "is_reminder_enabled": self.is_reminder_enabled,
            "is_reminded": self.is_reminded,
            "reminder_date": self.reminder_date,
            "is_notify_email": self.is_notify_email,
            "is_notify_on_website": self.is_notify_on_website,
        }
