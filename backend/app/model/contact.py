from typing import Optional
import sqlalchemy as sa
import sqlalchemy.orm as so
from .db import db

class Contact(db.Model):
    __tablename__ = "contacts"

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    job_id: so.Mapped[int] = so.mapped_column(sa.Integer, sa.ForeignKey('saved_jobs.id'))
    person_name: so.Mapped[str] = so.mapped_column(sa.String(150))
    person_position: so.Mapped[Optional[str]] = so.mapped_column(sa.String(150))
    person_linkedin: so.Mapped[Optional[str]] = so.mapped_column(sa.String(250))
    person_email: so.Mapped[Optional[str]] = so.mapped_column(sa.String(250))
    note: so.Mapped[Optional[str]] = so.mapped_column(sa.String(1000))

    def __repr__(self) -> str:
        return f"<Contact {self.person_name} {self.person_position}>"
