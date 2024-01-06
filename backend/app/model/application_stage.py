from typing import Optional
import sqlalchemy as sa
import sqlalchemy.orm as so
from .db import db

class ApplicationStage(db.Model):
    __tablename__ = "application_stages"

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    stage_name: so.Mapped[str] = so.mapped_column(sa.String(150))
    color: so.Mapped[str] = so.mapped_column(sa.String(150))
    position: so.Mapped[int] = so.mapped_column(sa.Integer)

    def __repr__(self) -> str:
        return f"<ApplicationStage {self.stage_name}>"