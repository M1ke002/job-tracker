from datetime import datetime, timezone
from typing import Optional, List
import sqlalchemy as sa
import sqlalchemy.orm as so
from .db import db

class ScrapedSite(db.Model):
    __tablename__ = "scraped_sites"

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    scraped_site_settings_id: so.Mapped[int] = so.mapped_column(sa.Integer, sa.ForeignKey("scraped_site_settings.id"))
    website_name: so.Mapped[str] = so.mapped_column(sa.String(150))
    last_scrape_date: so.Mapped[Optional[datetime]] = so.mapped_column(sa.DateTime(timezone=True))
    
    #relationship
    scraped_site_settings: so.Mapped["ScrapedSiteSettings"] = so.relationship(
        "ScrapedSiteSettings", back_populates="scraped_site")
    job_listings: so.Mapped[List["JobListing"]] = so.relationship(back_populates="scraped_site", lazy=True)
    
    def __repr__(self) -> str:
        return f"<ScrapedSite {self.website_name}>"
    
    def to_dict(self) -> dict:
        #sort job listings by created_at date
        # sorted_job_listings = sorted(self.job_listings, key=lambda job_listing: job_listing.created_at, reverse=True)
        return {
            "id": self.id,
            "scraped_site_settings_id": self.scraped_site_settings_id,
            "website_name": self.website_name,
            "last_scrape_date": self.last_scrape_date,
            "scraped_site_settings": self.scraped_site_settings.to_dict(),
            # "job_listings": [job_listing.to_dict() for job_listing in sorted_job_listings]
        }