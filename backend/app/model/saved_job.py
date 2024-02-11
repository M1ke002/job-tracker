from datetime import datetime
from typing import Optional, List
import sqlalchemy as sa
import sqlalchemy.orm as so
from .db import db

# if TYPE_CHECKING:
#     from .application_stage import ApplicationStage


class SavedJob(db.Model):
    __tablename__ = "saved_jobs"

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    # foreign key can be null
    stage_id: so.Mapped[Optional[int]] = so.mapped_column(
        sa.Integer, sa.ForeignKey("application_stages.id")
    )
    rejected_at_stage_id: so.Mapped[Optional[int]] = so.mapped_column(
        sa.Integer, sa.ForeignKey("application_stages.id")
    )
    job_title: so.Mapped[str] = so.mapped_column(sa.String(150))
    company_name: so.Mapped[str] = so.mapped_column(sa.String(150))
    location: so.Mapped[Optional[str]] = so.mapped_column(sa.String(200))
    job_description: so.Mapped[Optional[str]] = so.mapped_column(sa.String(6000))
    additional_info: so.Mapped[Optional[str]] = so.mapped_column(sa.String(500))
    salary: so.Mapped[Optional[str]] = so.mapped_column(sa.String(100))
    job_url: so.Mapped[str] = so.mapped_column(sa.String(500))
    job_date: so.Mapped[Optional[str]] = so.mapped_column(sa.String(100))
    notes: so.Mapped[Optional[str]] = so.mapped_column(sa.String(5000))
    position: so.Mapped[Optional[int]] = so.mapped_column(sa.Integer)
    created_at: so.Mapped[datetime] = so.mapped_column(default=lambda: datetime.now())

    # relationship
    stage: so.Mapped[Optional["ApplicationStage"]] = so.relationship(
        "ApplicationStage", back_populates="jobs", foreign_keys="SavedJob.stage_id"
    )
    # delete all tasks and contacts associated with this job when job is deleted
    tasks: so.Mapped[List["Task"]] = so.relationship(
        cascade="all, delete-orphan", lazy=True
    )
    contacts: so.Mapped[List["Contact"]] = so.relationship(
        cascade="all, delete-orphan", lazy=True
    )
    documents: so.Mapped[List["Document"]] = so.relationship(
        "Document", back_populates="job", lazy=True
    )

    def __repr__(self) -> str:
        return f"<SavedJob {self.job_title} {self.company_name}>"

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "stage_id": self.stage_id,
            "rejected_at_stage_id": self.rejected_at_stage_id,
            "job_title": self.job_title,
            "company_name": self.company_name,
            "location": self.location,
            "job_description": self.job_description,
            "additional_info": self.additional_info,
            "salary": self.salary,
            "job_url": self.job_url,
            "job_date": self.job_date,
            "notes": self.notes,
            "position": self.position,
            "created_at": self.created_at,
            # for stage only need id and stage_name
            "stage": (
                {"id": self.stage.id, "stage_name": self.stage.stage_name}
                if self.stage
                else None
            ),
            "tasks": [task.to_dict() for task in self.tasks],
            "contacts": [contact.to_dict() for contact in self.contacts],
            "documents": [document.to_dict() for document in self.documents],
        }
