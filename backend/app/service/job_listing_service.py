from app.model import db, JobListing
from sqlalchemy import or_, and_

def get_all_job_listings(scraped_site_id, page=1, per_page=30):
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
    total_job_count = JobListing.query.filter_by(scraped_site_id=scraped_site_id).count()
    
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
