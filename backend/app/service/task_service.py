from app.model import db, Task
from dateutil.parser import parse
from datetime import timedelta, timezone

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
    is_notify_on_website = data.get('isNotifyOnWebsite')

    if not job_id or not task_name:
        return None
    
    if due_date: 
        # Parse the due_date string into a datetime object
        due_date = parse(due_date)

        # Adjust the datetime object to GMT+7
        due_date = due_date.astimezone(timezone(timedelta(hours=7)))

        # Format the datetime object into the desired format
        due_date = due_date.strftime('%Y-%m-%d %H:%M:%S')

    task = Task(
        job_id = job_id,
        task_name = task_name,
        due_date = due_date,
        is_completed = False,
        is_reminder_enabled = is_reminder_enabled,
        is_reminded = False,
        reminder_date = reminder_date,
        is_notify_email = is_notify_email,
        is_notify_on_website = is_notify_on_website
    )

    db.session.add(task)
    db.session.commit()

    return task.to_dict()

def edit_task(task_id, data):
    task_name = data.get('taskName')
    due_date = data.get('dueDate')
    is_reminder_enabled = data.get('isReminderEnabled')
    is_reminded = data.get('isReminded')
    reminder_date = data.get('reminderDate')
    is_notify_email = data.get('isNotifyEmail')
    is_notify_on_website = data.get('isNotifyOnWebsite')

    if not task_name:
        return None
    
    if due_date:
        # Parse the due_date string into a datetime object
        due_date = parse(due_date)

        # Adjust the datetime object to GMT+7
        due_date = due_date.astimezone(timezone(timedelta(hours=7)))

        # Format the datetime object into the desired format
        due_date = due_date.strftime('%Y-%m-%d %H:%M:%S')
    
    task = Task.query.get(task_id)
    if task is None:
        return None
    
    task.task_name = task_name
    task.due_date = due_date
    task.is_reminder_enabled = is_reminder_enabled
    task.is_reminded = is_reminded
    task.reminder_date = reminder_date
    task.is_notify_email = is_notify_email
    task.is_notify_on_website = is_notify_on_website

    db.session.commit()
    return task.to_dict()

def set_task_complete(task_id, data):
    is_completed = data.get('isCompleted')
    if is_completed is None:
        return None
    task = Task.query.get(task_id)
    if task is None:
        return None
    task.is_completed = is_completed
    db.session.commit()
    return task.to_dict()

def toggle_task_reminder(task_id, data):
    is_reminder_enabled = data.get('isReminderEnabled')
    if is_reminder_enabled is None:
        return None
    task = Task.query.get(task_id)
    if task is None:
        return None
    task.is_reminder_enabled = is_reminder_enabled
    db.session.commit()
    return task.to_dict()

def delete_task(task_id):
    task = Task.query.get(task_id)
    if task is None:
        return None
    db.session.delete(task)
    db.session.commit()
    return "Deleted task successfully"
