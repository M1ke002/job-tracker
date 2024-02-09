from app.model import db, ApplicationStage, SavedJob

def get_all_application_stages():
    application_stages = ApplicationStage.query.all()
    return [application_stage.to_dict() for application_stage in application_stages]

def create_application_stage(stage_name, position):
    application_stage = ApplicationStage(
        stage_name = stage_name,
        position = position
    )

    db.session.add(application_stage)
    db.session.commit()

    return application_stage.to_dict()

def create_multiple_application_stages(application_stages):
    for application_stage in application_stages:
        stage_name = application_stage.get('stageName')
        position = application_stage.get('position')
        
        application_stage = ApplicationStage(
            stage_name = stage_name,
            position = position
        )

        db.session.add(application_stage)
    db.session.commit()
    return "created application stages successfully"


def update_stage_order(stage_positions):
    # sample: [{'id': 2, 'position': 0}, {'id': 1, 'position': 1}, {'id': 3, 'position': 2}, {'id': 4, 'position': 3}, {'id': 5, 'position': 4}]}
    for stage_position in stage_positions:
        application_stage = ApplicationStage.query.get(stage_position['id'])
        application_stage.position = stage_position['position']
    db.session.commit()
    return "updated stage order successfully"

def delete_application_stage(application_stage_id):
    application_stage = ApplicationStage.query.get(application_stage_id)
    if application_stage is None:
        return None
    db.session.delete(application_stage)
    db.session.commit()
    return "deleted application stage successfully"