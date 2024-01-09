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
    salary: so.Mapped[Optional[str]] = so.mapped_column(sa.String(100))
    job_url: so.Mapped[str] = so.mapped_column(sa.String(1000))
    job_date: so.Mapped[Optional[str]] = so.mapped_column(sa.String(100))
    is_new: so.Mapped[bool] = so.mapped_column(sa.Boolean, default=True)

    #relationship
    scraped_site: so.Mapped["ScrapedSite"] = so.relationship(
        "ScrapedSite", back_populates="job_listings", lazy=True)

    def __repr__(self) -> str:
        return f"<JobListing {self.job_title} {self.company_name}>"
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "scraped_site_id": self.scraped_site_id,
            "job_title": self.job_title,
            "company_name": self.company_name,
            "location": self.location,
            "job_description": self.job_description,
            "additional_info": self.additional_info,
            "salary": self.salary,
            "job_url": self.job_url,
            "job_date": self.job_date,
            "is_new": self.is_new
        }