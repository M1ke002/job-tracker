from app.model import db, SavedJob, ApplicationStage

def get_all_saved_jobs():
    saved_jobs = SavedJob.query.all()
    return [saved_job.to_dict() for saved_job in saved_jobs]

def get_saved_job(saved_job_id):
    saved_job = SavedJob.query.get(saved_job_id)
    if saved_job is None:
        return None
    return saved_job.to_dict()

def create_saved_job(data):
    job_title = data.get('jobTitle')
    company_name = data.get('companyName')
    location = data.get('location')
    job_description = data.get('jobDescription')
    additional_info = data.get('additionalInfo')
    salary = data.get('salary')
    job_url = data.get('jobUrl')
    job_date = data.get('jobDate')

    if not job_title or not company_name or not job_url:
        return None
    
    #check if a job with same title, company, and url already exists
    existing_job = SavedJob.query.filter_by(job_title=job_title, company_name=company_name, job_url=job_url).first()
    if existing_job:
        print("Job already exists")
        return None
    
    job = SavedJob(
        job_title = job_title,
        company_name = company_name,
        location = location,
        job_description = job_description,
        additional_info = additional_info,
        salary = salary,
        job_url = job_url,
        job_date = job_date
    )

    db.session.add(job)
    db.session.commit()

    return job.to_dict()

#currently not updating job_description, job_date, or notes
def edit_saved_job(saved_job_id, data):
    job_title = data.get('jobTitle')
    company_name = data.get('companyName')
    location = data.get('location')
    additional_info = data.get('additionalInfo')
    salary = data.get('salary')
    job_url = data.get('jobUrl')

    if not job_title or not company_name or not job_url:
        return None
    
    job = SavedJob.query.get(saved_job_id)
    if job is None:
        return None
    
    #check if a job with same title, company, and url already exists (except for current job)
    existing_job = SavedJob.query.filter_by(job_title=job_title, company_name=company_name, job_url=job_url).first()
    if existing_job and existing_job.id != saved_job_id:
        print("Job already exists")
        return None
    
    job.job_title = job_title
    job.company_name = company_name
    job.location = location
    job.additional_info = additional_info
    job.salary = salary
    job.job_url = job_url

    db.session.commit()
    return job.to_dict()

def update_job_stage(job_id, stage_name):
    job = SavedJob.query.get(job_id)
    if job is None:
        return None
    if (stage_name == "None"):
        job.stage_id = None
        db.session.commit()
        return job.to_dict()
    #search for application stage with stage_name
    print(stage_name)
    stage = ApplicationStage.query.filter_by(stage_name=stage_name).first()
    if stage is None:
        return None
    job.stage_id = stage.id
    # set job position to last position in stage
    job.position = len(stage.jobs)
    db.session.commit()
    return job.to_dict()

def update_job_order(data):
    job_positions = data.get('jobPositions')
    # sample: [{id: 1, stage_id: 1, position: 0}, {id: 2, stage_id: 1, position: 1}, ...]
    for job_position in job_positions:
        job = SavedJob.query.get(job_position['id'])
        job.stage_id = job_position['stage_id']
        job.position = job_position['position']
    db.session.commit()
    return "updated job order successfully"

def remove_job_from_stage(job_id, data):
    job_positions = data.get('jobPositions')
    # sample: [{id: 1, position: 0}, {id: 2, position: 1}, ...]

    #remove stage_id from job
    job = SavedJob.query.get(job_id)
    if job is None:
        return None
    job.stage_id = None
    
    #update positions of remaining jobs in stage
    for job_position in job_positions:
        job = SavedJob.query.get(job_position['id'])
        job.position = job_position['position']

    db.session.commit()
    return "removed job from stage successfully"

def delete_saved_job(saved_job_id):
    saved_job = SavedJob.query.get(saved_job_id)
    if saved_job is None:
        return None
    db.session.delete(saved_job)
    db.session.commit()
    return "Deleted saved job successfully"
