from app.model import db, SavedJob

def get_all_saved_jobs():
    saved_jobs = SavedJob.query.all()
    return [saved_job.to_dict() for saved_job in saved_jobs]

def get_saved_job(saved_job_id):
    saved_job = SavedJob.query.get(saved_job_id)
    if saved_job is None:
        return None
    return saved_job.to_dict()

def delete_saved_job(saved_job_id):
    saved_job = SavedJob.query.get(saved_job_id)
    if saved_job is None:
        return None
    db.session.delete(saved_job)
    db.session.commit()
    return saved_job.to_dict()
