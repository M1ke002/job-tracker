from typing import Optional, List
import sqlalchemy as sa
import sqlalchemy.orm as so
from .db import db

class ApplicationStage(db.Model):
    __tablename__ = "application_stages"

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    stage_name: so.Mapped[str] = so.mapped_column(sa.String(150))
    position: so.Mapped[int] = so.mapped_column(sa.Integer)

    #relationship
    jobs: so.Mapped[List["SavedJob"]] = so.relationship("SavedJob", back_populates="stage", lazy=True, foreign_keys='SavedJob.stage_id')

    def __repr__(self) -> str:
        return f"<ApplicationStage {self.stage_name}>"
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "stage_name": self.stage_name,
            "position": self.position,
            "jobs": [job.to_dict() for job in self.jobs]
        }