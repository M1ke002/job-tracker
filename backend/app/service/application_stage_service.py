from app.model import db, ApplicationStage, SavedJob

def get_all_application_stages():
    application_stages = ApplicationStage.query.all()
    #first time running, need to init the stages
    if len(application_stages) == 0:
        application_stages = [
            ApplicationStage(stage_name = 'Applied', position = 0),
            ApplicationStage(stage_name = 'O.A.', position = 1),
            ApplicationStage(stage_name = 'Interviewing', position = 2),
            ApplicationStage(stage_name = 'Offer', position = 3),
            ApplicationStage(stage_name = 'Rejected', position = 4),
        ]
        db.session.bulk_save_objects(application_stages)
        db.session.commit()
        application_stages = ApplicationStage.query.all()
    return [application_stage.to_dict() for application_stage in application_stages]

def create_application_stage(data):
    stage_name = data.get('stageName')
    color = data.get('color')
    position = data.get('position')
    
    if not stage_name or not color or not position:
        return None
    
    application_stage = ApplicationStage(
        stage_name = stage_name,
        color = color,
        position = position
    )

    db.session.add(application_stage)
    db.session.commit()

    return application_stage.to_dict()

def update_stage_order(data):
    stage_positions = data.get('stagePositions')
    # sample: [{'id': 2, 'position': 0}, {'id': 1, 'position': 1}, {'id': 3, 'position': 2}, {'id': 4, 'position': 3}, {'id': 5, 'position': 4}]}
    for stage_position in stage_positions:
        application_stage = ApplicationStage.query.get(stage_position['id'])
        application_stage.position = stage_position['position']
    db.session.commit()
    return "updated stage order successfully"

def update_job_order(data):
    job_positions = data.get('jobPositions')
    # sample: [{id: 1, stage_id: 1, position: 0}, {id: 2, stage_id: 1, position: 1}, ...]
    for job_position in job_positions:
        job = SavedJob.query.get(job_position['id'])
        job.stage_id = job_position['stage_id']
        job.position = job_position['position']
    db.session.commit()
    return "updated job order successfully"

def delete_application_stage(application_stage_id):
    application_stage = ApplicationStage.query.get(application_stage_id)
    if application_stage is None:
        return None
    db.session.delete(application_stage)
    db.session.commit()
    return application_stage.to_dict()