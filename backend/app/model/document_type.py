import sqlalchemy as sa
import sqlalchemy.orm as so
from .db import db

class DocumentType(db.Model):
    __tablename__ = "document_types"

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    type_name: so.Mapped[str] = so.mapped_column(sa.String(150))

    def __repr__(self) -> str:
        return f"<DocumentType {self.type_name}>"