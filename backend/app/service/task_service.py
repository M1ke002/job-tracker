from app.model import db, Task

def get_all_tasks():
    tasks = Task.query.all()
    return [task.to_dict() for task in tasks]

def create_task(data):
    job_id = data.get('jobId')
    task_name = data.get('taskName')
    due_date = data.get('dueDate')
    is_reminder_enabled = data.get('isReminderEnabled')
    reminder_date = data.get('reminderDate')
    is_notify_email = data.get('isNotifyEmail')
    is_notify_notification = data.get('isNotifyNotification')

    if not job_id or not task_name:
        return None
    
    task = Task(
        job_id = job_id,
        task_name = task_name,
        due_date = due_date,
        is_completed = False,
        is_reminder_enabled = is_reminder_enabled,
        reminder_date = reminder_date,
        is_notify_email = is_notify_email,
        is_notify_notification = is_notify_notification
    )

    db.session.add(task)
    db.session.commit()

    return task.to_dict()

def delete_task(task_id):
    task = Task.query.get(task_id)
    if task is None:
        return None
    db.session.delete(task)
    db.session.commit()
    return task.to_dict()
