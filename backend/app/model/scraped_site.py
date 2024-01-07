from datetime import datetime, timezone
from typing import Optional, List
import sqlalchemy as sa
import sqlalchemy.orm as so
from .db import db

class ScrapedSite(db.Model):
    __tablename__ = "scraped_sites"

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    website_name: so.Mapped[str] = so.mapped_column(sa.String(150))
    scrape_url: so.Mapped[str] = so.mapped_column(sa.String(1000))
    is_scrape_enabled: so.Mapped[bool] = so.mapped_column(sa.Boolean)
    #scrape frequency in days
    scrape_frequency: so.Mapped[int] = so.mapped_column(sa.Integer)
    is_notification_enabled: so.Mapped[bool] = so.mapped_column(sa.Boolean)
    is_notify_email: so.Mapped[bool] = so.mapped_column(sa.Boolean)
    is_notify_notification: so.Mapped[bool] = so.mapped_column(sa.Boolean)
    last_scrape_date: so.Mapped[datetime] = so.mapped_column(
        default=lambda: datetime.now())
    
    #relationship
    job_listings: so.Mapped[List["JobListing"]] = so.relationship(lazy=True)
    
    def __repr__(self) -> str:
        return f"<ScrapedSite {self.website_name}>"