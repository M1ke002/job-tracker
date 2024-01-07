from typing import Optional
import sqlalchemy as sa
import sqlalchemy.orm as so
from .db import db
from datetime import datetime, timezone

class Task(db.Model):
    __tablename__ = "tasks"

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    job_id: so.Mapped[int] = so.mapped_column(sa.Integer, sa.ForeignKey('saved_jobs.id'))
    task_name: so.Mapped[str] = so.mapped_column(sa.String(150))
    due_date: so.Mapped[Optional[datetime]] = so.mapped_column(default=lambda: datetime.now())
    is_completed: so.Mapped[bool] = so.mapped_column(sa.Boolean)
    is_reminder_enabled: so.Mapped[bool] = so.mapped_column(sa.Boolean)
    #no of days before due date to send reminder
    reminder_date: so.Mapped[Optional[int]] = so.mapped_column(sa.Integer)
    is_notify_email: so.Mapped[bool] = so.mapped_column(sa.Boolean)
    is_notify_notification: so.Mapped[bool] = so.mapped_column(sa.Boolean)

    def __repr__(self) -> str:
        return f"<Task {self.task_name} {self.due_date}>"