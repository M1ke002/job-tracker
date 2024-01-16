from app.model import db, JobListing

def get_all_job_listings(scraped_site_id, page=1, per_page=30):
    #query job listings, paginate by 30/page and sort by created_at date, return total pages
    job_listings = JobListing.query.filter_by(scraped_site_id=scraped_site_id).order_by(JobListing.created_at.desc()).paginate(per_page=per_page, page=page, error_out=False)
    
    return [job.to_dict() for job in job_listings.items]
