from app.model import db, JobListing

def get_all_job_listings(scraped_site_id):
    job_listings = JobListing.query.filter_by(scraped_site_id=scraped_site_id).all()
    return [job_listing.to_dict() for job_listing in job_listings]
