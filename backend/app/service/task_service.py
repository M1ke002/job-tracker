from app.model import db, Task

def get_all_tasks():
    tasks = Task.query.all()
    return [task.to_dict() for task in tasks]

def delete_task(task_id):
    task = Task.query.get(task_id)
    if task is None:
        return None
    db.session.delete(task)
    db.session.commit()
    return task.to_dict()
