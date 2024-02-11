from app.model import db, JobListing
from sqlalchemy import or_, and_
from sqlalchemy.orm.session import Session
from datetime import datetime, timedelta

from app.utils.scraper.helper import find_new_job_listings


def get_all_job_listings_paginated(scraped_site_id, page=1, per_page=30):
    # query job listings, paginate by 30/page and sort by created_at date, return total pages
    job_listings = (
        JobListing.query.filter_by(scraped_site_id=scraped_site_id)
        .order_by(JobListing.created_at.desc())
        .paginate(per_page=per_page, page=page, error_out=False)
    )

    # get total pages
    total_pages = job_listings.pages

    # get total job count
    total_job_count = get_job_count_for_site(scraped_site_id)

    return [job.to_dict() for job in job_listings.items], total_pages, total_job_count


def get_all_job_listings_in_db_for_site(session: Session, scraped_site_id: int):
    query = session.query(JobListing).filter(
        JobListing.scraped_site_id == scraped_site_id
    )
    return query.all()


def search_job_listings(scraped_site_id, query, page=1, per_page=30):
    # allow for partial matches on job title and job description and company name, case insensitive
    print("query: ", query)

    job_listings = (
        JobListing.query.filter(
            and_(
                JobListing.scraped_site_id == scraped_site_id,
                or_(
                    JobListing.job_title.ilike(f"%{query}%"),
                    JobListing.job_description.ilike(f"%{query}%"),
                    JobListing.company_name.ilike(f"%{query}%"),
                ),
            )
        )
        .order_by(JobListing.created_at.desc())
        .paginate(per_page=per_page, page=page, error_out=False)
    )

    # get total pages
    total_pages = job_listings.pages
    print("total_pages: ", total_pages)

    # get total job count
    total_job_count = JobListing.query.filter(
        and_(
            JobListing.scraped_site_id == scraped_site_id,
            or_(
                JobListing.job_title.ilike(f"%{query}%"),
                JobListing.job_description.ilike(f"%{query}%"),
                JobListing.company_name.ilike(f"%{query}%"),
            ),
        )
    ).count()

    return [job.to_dict() for job in job_listings.items], total_pages, total_job_count


def create_job_listings_in_db(session: Session, job_listings: list[JobListing]):
    for job_listing in job_listings:
        session.add(job_listing)
    session.commit()


def create_job_listings_for_site(scraped_site_id, jobs):
    job_listings = []
    for job in jobs:
        job_listing = JobListing(
            scraped_site_id=scraped_site_id,
            job_title=job["job_title"],
            company_name=job["company_name"],
            location=job["location"],
            job_description=job["job_description"],
            additional_info=job["additional_info"],
            salary=job["salary"],
            job_url=job["job_url"],
            job_date=job["job_date"],
            is_new=job["is_new"],
        )
        job_listings.append(job_listing)

    create_job_listings_in_db(db.session, job_listings)
    return f"Created {len(job_listings)} job listings for site {scraped_site_id}"


def get_job_count_for_site(scraped_site_id):
    return JobListing.query.filter_by(scraped_site_id=scraped_site_id).count()


def get_new_job_listings(scraped_site_id, scraped_jobs):
    # get existing job listings from db
    existing_job_listings = get_all_job_listings_in_db_for_site(
        db.session, scraped_site_id
    )
    existing_job_dict = [job.to_dict() for job in existing_job_listings]

    # update is_new to False for existing jobs.
    # After scraping new jobs, we will update is_new to True for current new jobs (since they are not new anymore)
    current_new_jobs = [job for job in existing_job_listings if job.is_new]
    set_job_listings_is_new_in_db(db.session, current_new_jobs, False)

    # delete old job listings
    cut_off_date = datetime.now() - timedelta(days=3)
    delete_old_job_listings_in_db_for_site(db.session, scraped_site_id, cut_off_date)

    # find new job listings
    new_jobs = find_new_job_listings(existing_job_dict, scraped_jobs)
    return new_jobs


def delete_all_old_job_listings_in_db(session: Session, cut_off_date: datetime):
    query = session.query(JobListing).filter(JobListing.created_at < cut_off_date)
    query.delete()
    session.commit()


def delete_old_job_listings_in_db_for_site(
    session: Session, scraped_site_id: int, cut_off_date: datetime
):
    query = session.query(JobListing).filter(
        and_(
            JobListing.scraped_site_id == scraped_site_id,
            JobListing.created_at < cut_off_date,
        )
    )
    query.delete()
    session.commit()


def set_job_listings_is_new_in_db(
    session: Session, job_listings: list[JobListing], is_new: bool = True
):
    for job_listing in job_listings:
        job_listing.is_new = is_new
    session.commit()
