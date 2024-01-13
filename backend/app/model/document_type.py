from typing import List
import sqlalchemy as sa
import sqlalchemy.orm as so
from .db import db

class DocumentType(db.Model):
    __tablename__ = "document_types"

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    type_name: so.Mapped[str] = so.mapped_column(sa.String(150))

    #relationship
    documents: so.Mapped[List["Document"]] = so.relationship("Document", back_populates="document_type")

    def __repr__(self) -> str:
        return f"<DocumentType {self.type_name}>"
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "type_name": self.type_name,
            "documents": [document.to_dict() for document in self.documents]
        }