from typing import Optional, List, TYPE_CHECKING
import sqlalchemy as sa
import sqlalchemy.orm as so
from .db import db

# if TYPE_CHECKING:
#     from .application_stage import ApplicationStage

class SavedJob(db.Model):
    __tablename__ = "saved_jobs"

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    #foreign key can be null
    stage_id: so.Mapped[Optional[int]] = so.mapped_column(sa.Integer, sa.ForeignKey('application_stages.id'))
    job_title: so.Mapped[str] = so.mapped_column(sa.String(150))
    company_name: so.Mapped[str] = so.mapped_column(sa.String(150))
    location: so.Mapped[Optional[str]] = so.mapped_column(sa.String(250))
    job_description: so.Mapped[Optional[str]] = so.mapped_column(sa.String(1000))
    additional_info: so.Mapped[Optional[str]] = so.mapped_column(sa.String(1000))
    job_type: so.Mapped[Optional[str]] = so.mapped_column(sa.String(100))
    salary: so.Mapped[Optional[str]] = so.mapped_column(sa.String(100))
    job_url: so.Mapped[str] = so.mapped_column(sa.String(1000))
    posted_date: so.Mapped[Optional[str]] = so.mapped_column(sa.String(100))
    notes: so.Mapped[Optional[str]] = so.mapped_column(sa.String(1000))
    position: so.Mapped[int] = so.mapped_column(sa.Integer)

    #relationship
    stage: so.Mapped[Optional["ApplicationStage"]] = so.relationship("ApplicationStage", back_populates="jobs")
    #delete all tasks and contacts associated with this job when job is deleted
    tasks: so.Mapped[List["Task"]] = so.relationship(cascade="all, delete-orphan", lazy=True)
    contacts: so.Mapped[List["Contact"]] = so.relationship(cascade="all, delete-orphan", lazy=True)

    def __repr__(self) -> str:
        return f"<SavedJob {self.job_title} {self.company_name}>"