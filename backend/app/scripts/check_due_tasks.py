from datetime import datetime, timedelta
from app.model import Task, Notification

from sqlalchemy.orm.session import Session

#input: connection, cursor, task_ids: list of tasks
def set_tasks_as_reminded(session: Session, tasks: list[Task]):
    for task in tasks:
        task.is_reminded = True
    session.commit()
        

def find_and_update_due_tasks(session: Session, tasks: list[Task]):
    res = []
    reminded_tasks = []
    
    for task in tasks:
        #check if current date + reminder_date is equal to due_date
        current_date = datetime.now()
        expected_date = current_date + timedelta(days=task.reminder_date)
        #expected date format: 2024-02-02 21:00:00
        print(expected_date.day, task.due_date.day, task.task_name)

        if (expected_date.year == task.due_date.year) and (expected_date.month == task.due_date.month) and (expected_date.day == task.due_date.day):
            if task.reminder_date == 1:
                date_message = 'tomorrow'
            elif task.reminder_date == 7:
                date_message = 'in a week'
            else:
                date_message = f'in {task.reminder_date} days'
            data = {
                'task_name': task.task_name,
                'due_date': task.due_date,
                'is_notify_email': task.is_notify_email,
                'is_notify_on_website': task.is_notify_on_website,
                'date_message': date_message
            }
            res.append(data)
            reminded_tasks.append(task)

    set_tasks_as_reminded(session, reminded_tasks)
    return res


def fetch_all_due_tasks(session: Session):
    #get all tasks which are not completed and is_reminder_enabled is true and due_date is not null
    query = session.query(Task).filter(
        Task.is_completed == False,
        Task.is_reminder_enabled == True, 
        Task.is_reminded == False, 
        Task.due_date != None
    )
    return query.all()


def create_notification(session: Session, task_name: str, due_date: str, date_message: str):
    #scraped_site_id is null for tasks
    message = f'Task: {task_name} is due {date_message} on {due_date}.'
    notification = Notification(
        scraped_site_id=None,
        message=message,
        is_read=False
    )
    session.add(notification)
    session.commit()


def check_due_tasks(session: Session):
    email_data = {
        'type': 'tasks',
        'data': []
    }

    #fetch all tasks
    tasks = fetch_all_due_tasks(session)

    #find and update due tasks
    due_tasks_data = find_and_update_due_tasks(session, tasks)

    for task_data in due_tasks_data:
        task_name = task_data['task_name']
        due_date = task_data['due_date']
        is_notify_email = task_data['is_notify_email']
        is_notify_on_website = task_data['is_notify_on_website']
        date_message = task_data['date_message']

        #format due date in format dd/mm/yyyy
        formatted_due_date = due_date.strftime('%d/%m/%Y')
        
        if is_notify_on_website:
            create_notification(session, task_name, formatted_due_date, date_message)
        
        if is_notify_email:
            email_data['data'].append({
                'task_name': task_name,
                'due_date': formatted_due_date,
                'date_message': date_message
            })

    return email_data