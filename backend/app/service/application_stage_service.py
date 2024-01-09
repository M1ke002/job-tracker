from app.model import db, ApplicationStage

def get_all_application_stages():
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

def delete_application_stage(application_stage_id):
    application_stage = ApplicationStage.query.get(application_stage_id)
    if application_stage is None:
        return None
    db.session.delete(application_stage)
    db.session.commit()
    return application_stage.to_dict()