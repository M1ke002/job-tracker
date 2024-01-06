from typing import Optional
import sqlalchemy as sa
import sqlalchemy.orm as so
from .db import db

class Document(db.Model):
    __tablename__ = "documents"

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    document_type_id: so.Mapped[int] = so.mapped_column(sa.Integer, sa.ForeignKey('document_types.id'))
    job_id: so.Mapped[Optional[int]] = so.mapped_column(sa.Integer, sa.ForeignKey('saved_jobs.id'))
    document_name: so.Mapped[str] = so.mapped_column(sa.String(150))
    date_uploaded: so.Mapped[str] = so.mapped_column(sa.String(100))

    def __repr__(self) -> str:
        return f"<Document {self.document_name}>"