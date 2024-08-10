from typing import Optional, List
import sqlalchemy as sa
import sqlalchemy.orm as so
from .db import db
from .associations import job_document_association
from datetime import datetime


class Document(db.Model):
    __tablename__ = "documents"

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    document_type_id: so.Mapped[int] = so.mapped_column(sa.Integer, sa.ForeignKey("document_types.id"))
    file_name: so.Mapped[str] = so.mapped_column(sa.String(150))
    file_url: so.Mapped[str] = so.mapped_column(sa.String(500))
    date_uploaded: so.Mapped[datetime] = so.mapped_column(default=lambda: datetime.now())

    # relationship
    document_type: so.Mapped["DocumentType"] = so.relationship("DocumentType", back_populates="documents")
    # job: so.Mapped[Optional["SavedJob"]] = so.relationship("SavedJob", back_populates="documents")
    jobs: so.Mapped[List["SavedJob"]] = so.relationship(
        "SavedJob", secondary=job_document_association, back_populates="documents", lazy=True
    )

    def __repr__(self) -> str:
        return f"<Document {self.file_name}>"

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "document_type_id": self.document_type_id,
            "document_type_name": self.document_type.type_name,
            "file_name": self.file_name,
            "file_url": self.file_url,
            "date_uploaded": self.date_uploaded,
            "jobs": [{"id": job.id, "job_title": job.job_title} for job in self.jobs],
        }
