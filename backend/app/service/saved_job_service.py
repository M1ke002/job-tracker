from app.model import db, SavedJob, ApplicationStage


def get_all_saved_jobs():
    saved_jobs = SavedJob.query.all()
    return [saved_job.to_dict() for saved_job in saved_jobs]


def get_saved_job(saved_job_id):
    saved_job = SavedJob.query.get(saved_job_id)
    if saved_job is None:
        return None
    return saved_job.to_dict()


def is_similar_job_exists(job_title, company_name, job_url, compared_job_id=None):
    existing_job = SavedJob.query.filter_by(job_title=job_title, company_name=company_name, job_url=job_url).first()
    # if job exists and is not the same job being compared
    if existing_job and existing_job.id != compared_job_id:
        return True
    return False


def create_saved_job(data):
    job_title = data.get("jobTitle")
    company_name = data.get("companyName")
    location = data.get("location")
    job_description = data.get("jobDescription")
    additional_info = data.get("additionalInfo")
    salary = data.get("salary")
    job_url = data.get("jobUrl")
    job_date = data.get("jobDate")

    job = SavedJob(
        job_title=job_title,
        company_name=company_name,
        location=location,
        job_description=job_description,
        additional_info=additional_info,
        salary=salary,
        job_url=job_url,
        job_date=job_date,
        is_favorite=False,
    )

    db.session.add(job)
    db.session.commit()

    return job.to_dict()


# currently not updating job_description, job_date, or notes
def edit_saved_job(saved_job_id, data):
    job_title = data.get("jobTitle")
    company_name = data.get("companyName")
    location = data.get("location")
    additional_info = data.get("additionalInfo")
    salary = data.get("salary")
    job_url = data.get("jobUrl")

    job = SavedJob.query.get(saved_job_id)
    if job is None:
        return None

    job.job_title = job_title
    job.company_name = company_name
    job.location = location
    job.additional_info = additional_info
    job.salary = salary
    job.job_url = job_url

    db.session.commit()
    return job.to_dict()


def toggle_favorite(saved_job_id, is_favorite):
    job = SavedJob.query.get(saved_job_id)
    if job is None:
        return None
    job.is_favorite = is_favorite
    db.session.commit()
    return job.to_dict()


def edit_saved_job_notes(saved_job_id, notes):
    job = SavedJob.query.get(saved_job_id)
    if job is None:
        return None
    job.notes = notes
    db.session.commit()
    return job.to_dict()


def edit_saved_job_description(saved_job_id, description):
    job = SavedJob.query.get(saved_job_id)
    if job is None:
        return None
    job.job_description = description
    db.session.commit()
    return job.to_dict()


def update_job_stage(job_id, stage_id):
    job = SavedJob.query.get(job_id)

    if job is None:
        return None

    if stage_id == "None":
        job.stage_id = None
        job.rejected_at_stage_id = None
        db.session.commit()
        return job.to_dict()

    # search for application stage with stage_id
    print(stage_id)
    stage = ApplicationStage.query.filter_by(id=stage_id).first()

    if stage is None:
        return None

    # if stage is rejected, and job doesnt have a stage yet -> set default to stage with name = 'Applied'
    if stage.stage_name == "Rejected":
        if job.rejected_at_stage_id is None:
            stage_apply = ApplicationStage.query.filter_by(stage_name="Applied").first()
            job.rejected_at_stage_id = stage_apply.id
    else:
        job.rejected_at_stage_id = stage.id

    job.stage_id = stage.id
    # set job position to last position in stage
    job.position = len(stage.jobs)
    db.session.commit()
    return job.to_dict()


def update_job_order(job_positions):
    # sample: [{id: 1, stage_id: 1, position: 0, rejected_at_stage_id: 1}
    # {id: 2, stage_id: 1, position: 1, rejected_at_stage_id: 1}, ...]
    res = []
    for job_position in job_positions:
        job = SavedJob.query.get(job_position["id"])
        if job is None:
            return None
        job.stage_id = job_position["stage_id"]
        job.rejected_at_stage_id = job_position["rejected_at_stage_id"]
        job.position = job_position["position"]
        res.append(job.to_dict())
    db.session.commit()
    return res


def remove_job_from_stage(job_id, job_positions):
    # remove stage_id from job
    job = SavedJob.query.get(job_id)
    if job is None:
        return None

    job.stage_id = None
    job.rejected_at_stage_id = None

    # sample job_positions: [{id: 1, position: 0}, {id: 2, position: 1}, ...]
    # update positions of remaining jobs in the same stage
    res = []

    for job_position in job_positions:
        job = SavedJob.query.get(job_position["id"])
        if job is None:
            return None
        job.position = job_position["position"]
        res.append(job.to_dict())

    db.session.commit()
    return res


def delete_saved_job(saved_job_id):
    saved_job = SavedJob.query.get(saved_job_id)
    if saved_job is None:
        return None
    db.session.delete(saved_job)
    db.session.commit()
    return "Deleted saved job successfully"
