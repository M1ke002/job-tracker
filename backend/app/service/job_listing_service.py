from app.model import db, JobListing
from sqlalchemy import or_, and_
from datetime import datetime, timedelta

from app.utils.scraper.helper import findNewJobListings

def get_all_job_listings_paginated(scraped_site_id, page=1, per_page=30):
    #query job listings, paginate by 30/page and sort by created_at date, return total pages
    # job_listings = JobListing.query.filter_by(scraped_site_id=scraped_site_id).order_by(JobListing.created_at.desc()).paginate(per_page=per_page, page=page, error_out=False)
    job_listings = (
        JobListing.query.filter_by(scraped_site_id=scraped_site_id)
        .order_by(JobListing.created_at.desc())
        .paginate(per_page=per_page, page=page, error_out=False)
    )

    #get total pages
    total_pages = job_listings.pages

    #get total job count
    total_job_count = get_job_count_for_site(scraped_site_id)
    
    return [job.to_dict() for job in job_listings.items], total_pages, total_job_count

def search_job_listings(scraped_site_id, query, page=1, per_page=30):
    #allow for partial matches on job title and job description and company name, case insensitive
    print("query: ", query)
    
    job_listings = (
        JobListing.query.filter(
            and_(
                JobListing.scraped_site_id == scraped_site_id,
                or_(
                    JobListing.job_title.ilike(f"%{query}%"),
                    JobListing.job_description.ilike(f"%{query}%"),
                    JobListing.company_name.ilike(f"%{query}%")
                )
            )
        )   
        .order_by(JobListing.created_at.desc())
        .paginate(per_page=per_page, page=page, error_out=False)
    )

    #get total pages
    total_pages = job_listings.pages
    print("total_pages: ", total_pages)

    #get total job count
    total_job_count = JobListing.query.filter(
        and_(
            JobListing.scraped_site_id == scraped_site_id,
            or_(
                JobListing.job_title.ilike(f"%{query}%"),
                JobListing.job_description.ilike(f"%{query}%"),
                JobListing.company_name.ilike(f"%{query}%")
            )
        )
    ).count()

    return [job.to_dict() for job in job_listings.items], total_pages, total_job_count

def create_job_listings_for_site(scraped_site_id, job_listings):
    for job in job_listings:
        job_listing = JobListing(
            scraped_site_id=scraped_site_id,
            job_title=job['job_title'],
            company_name=job['company_name'],
            location=job['location'],
            job_description=job['job_description'],
            additional_info=job['additional_info'],
            salary=job['salary'],
            job_url=job['job_url'],
            job_date=job['job_date'],
            is_new=job['is_new']
        )
        db.session.add(job_listing)
    db.session.commit()
    return f"Created {len(job_listings)} job listings for site {scraped_site_id}"

def get_job_count_for_site(scraped_site_id):
    return JobListing.query.filter_by(scraped_site_id=scraped_site_id).count()

def find_new_job_listings(scraped_site_id, scraped_jobs):
    # get existing job listings from db
    existing_job_listings = JobListing.query.filter_by(scraped_site_id=scraped_site_id).all()
    existing_job_dict = [job.to_dict() for job in existing_job_listings]

    # update is_new to False for existing jobs, but delete it if its created_at is more than 3 days ago
    for existing_job_listing in existing_job_listings:
        cut_off_date = datetime.now() - timedelta(days=3)
        if (existing_job_listing.created_at < cut_off_date):
            db.session.delete(existing_job_listing)
        else:
            if (existing_job_listing.is_new): 
                existing_job_listing.is_new = False

    db.session.commit()

   # find new job listings
    new_jobs = findNewJobListings(existing_job_dict, scraped_jobs)
    return new_jobs