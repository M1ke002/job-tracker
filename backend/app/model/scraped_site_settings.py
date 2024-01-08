from datetime import datetime, timezone
from typing import Optional, List
import sqlalchemy as sa
import sqlalchemy.orm as so
from .db import db

class ScrapedSiteSettings(db.Model):

    __tablename__ = "scraped_site_settings"

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    is_scrape_enabled: so.Mapped[bool] = so.mapped_column(sa.Boolean)
    #scrape frequency in days
    scrape_frequency: so.Mapped[int] = so.mapped_column(sa.Integer)
    max_pages_to_scrape: so.Mapped[int] = so.mapped_column(sa.Integer)
    is_notification_enabled: so.Mapped[bool] = so.mapped_column(sa.Boolean)
    is_notify_email: so.Mapped[bool] = so.mapped_column(sa.Boolean)
    is_notify_notification: so.Mapped[bool] = so.mapped_column(sa.Boolean)

    #url query settings
    search_keyword: so.Mapped[Optional[str]] = so.mapped_column(sa.String(150))
    location: so.Mapped[Optional[str]] = so.mapped_column(sa.String(150))

    #url query settings for ausgrad
    job_type: so.Mapped[Optional[str]] = so.mapped_column(sa.String(150))

    #url query settings for seek (discipline is same as classification, works for both sites)
    work_type: so.Mapped[Optional[str]] = so.mapped_column(sa.String(150))
    classification: so.Mapped[Optional[str]] = so.mapped_column(sa.String(150))

    #relationship
    scraped_site: so.Mapped["ScrapedSite"] = so.relationship(
        "ScrapedSite", back_populates="scraped_site_settings", lazy=True)

    def __repr__(self) -> str:
        return f"<ScrapedSiteSettings {self.id}>"
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "is_scrape_enabled": self.is_scrape_enabled,
            "scrape_frequency": self.scrape_frequency,
            "max_pages_to_scrape": self.max_pages_to_scrape,
            "is_notification_enabled": self.is_notification_enabled,
            "is_notify_email": self.is_notify_email,
            "is_notify_notification": self.is_notify_notification,
            "search_keyword": self.search_keyword,
            "location": self.location,
            "job_type": self.job_type,
            "work_type": self.work_type,
            "classification": self.classification
        }
