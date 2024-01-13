from typing import Optional
import sqlalchemy as sa
import sqlalchemy.orm as so
from .db import db
from datetime import datetime

class Document(db.Model):
    __tablename__ = "documents"

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    document_type_id: so.Mapped[int] = so.mapped_column(sa.Integer, sa.ForeignKey('document_types.id'))
    job_id: so.Mapped[Optional[int]] = so.mapped_column(sa.Integer, sa.ForeignKey('saved_jobs.id'))
    document_name: so.Mapped[str] = so.mapped_column(sa.String(150))
    date_uploaded: so.Mapped[datetime] = so.mapped_column(
        default=lambda: datetime.now())

    #relationship
    document_type: so.Mapped["DocumentType"] = so.relationship("DocumentType", back_populates="documents")
    job: so.Mapped[Optional["SavedJob"]] = so.relationship()

    def __repr__(self) -> str:
        return f"<Document {self.document_name}>"
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "document_type_id": self.document_type_id,
            "job_id": self.job_id,
            "job_title": self.job.job_title if self.job else None,
            "document_type_name": self.document_type.type_name,
            "document_name": self.document_name,
            "date_uploaded": self.date_uploaded,
        }