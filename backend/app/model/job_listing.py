from typing import Optional
import sqlalchemy as sa
import sqlalchemy.orm as so
from .db import db

class JobListing(db.Model):
    __tablename__ = "job_listings"

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    scraped_site_id: so.Mapped[int] = so.mapped_column(sa.Integer, sa.ForeignKey('scraped_sites.id'))
    job_title: so.Mapped[str] = so.mapped_column(sa.String(150))
    company_name: so.Mapped[str] = so.mapped_column(sa.String(150))
    location: so.Mapped[Optional[str]] = so.mapped_column(sa.String(250))
    job_description: so.Mapped[Optional[str]] = so.mapped_column(sa.String(1000))
    additional_info: so.Mapped[Optional[str]] = so.mapped_column(sa.String(1000))
    job_type: so.Mapped[Optional[str]] = so.mapped_column(sa.String(100))
    salary: so.Mapped[Optional[str]] = so.mapped_column(sa.String(100))
    job_url: so.Mapped[str] = so.mapped_column(sa.String(1000))
    posted_date: so.Mapped[Optional[str]] = so.mapped_column(sa.String(100))
    is_new: so.Mapped[bool] = so.mapped_column(sa.Boolean)

    def __repr__(self) -> str:
        return f"<JobListing {self.job_title} {self.company_name}>"