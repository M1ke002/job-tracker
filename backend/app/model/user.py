from typing import Optional
import sqlalchemy as sa
import sqlalchemy.orm as so
from .db import db

class User(db.Model):
    __tablename__ = "users"

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    username: so.Mapped[str] = so.mapped_column(sa.String(60), index=True, unique=True)
    email: so.Mapped[str] = so.mapped_column(sa.String(100), index=True, unique=True)
    password: so.Mapped[str] = so.mapped_column(sa.String(200))

    def __repr__(self) -> str:
        return f"<User {self.username}>"
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "password": self.password
        }
