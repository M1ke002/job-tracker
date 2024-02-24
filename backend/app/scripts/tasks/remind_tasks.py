from datetime import datetime
from app.utils.utils import utc_to_sydney_time
from app.model import Task
from app.service.task_service import set_tasks_reminded_in_db, get_all_due_tasks_in_db
from app.service.notification_service import create_notification_in_db

from sqlalchemy.orm.session import Session


# input: connection, cursor, task_ids: list of tasks
def set_tasks_as_reminded(session: Session, tasks: list[Task]):
    set_tasks_reminded_in_db(session, tasks)


def find_and_update_due_tasks(session: Session, tasks: list[Task], current_date: datetime):
    res = []
    reminded_tasks = []

    for task in tasks:
        # check if current date is equal to due_date
        if (
            (current_date.year == task.due_date.year)
            and (current_date.month == task.due_date.month)
            and (current_date.day == task.due_date.day)
        ):
            date_message = "today"
            data = {
                "task_name": task.task_name,
                "due_date": task.due_date,
                "is_notify_email": task.is_notify_email,
                "is_notify_on_website": task.is_notify_on_website,
                "date_message": date_message,
            }
            res.append(data)
            reminded_tasks.append(task)

    print(f"Found {len(reminded_tasks)} tasks to remind")
    set_tasks_as_reminded(session, reminded_tasks)
    return res


def fetch_all_due_tasks(session: Session):
    return get_all_due_tasks_in_db(session)


def create_notification(session: Session, task_name: str, due_date: str, date_message: str, date: datetime):
    # scraped_site_id is null for tasks
    message = f"Task: {task_name} is due {date_message} on {due_date}."
    create_notification_in_db(
        session=session,
        message=message,
        created_at=date,
    )


async def check_due_tasks(session: Session):
    email_data = {"type": "tasks", "data": []}
    current_date = utc_to_sydney_time(datetime.now())

    # fetch all tasks
    tasks = fetch_all_due_tasks(session)

    print(tasks)

    # find and update due tasks
    due_tasks_data = find_and_update_due_tasks(session, tasks, current_date)

    for task_data in due_tasks_data:
        task_name = task_data["task_name"]
        due_date = task_data["due_date"]
        is_notify_email = task_data["is_notify_email"]
        is_notify_on_website = task_data["is_notify_on_website"]
        date_message = task_data["date_message"]

        # format due date in format dd/mm/yyyy
        formatted_due_date = due_date.strftime("%d/%m/%Y")

        if is_notify_on_website:
            create_notification(session, task_name, formatted_due_date, date_message, current_date)

        if is_notify_email:
            email_data["data"].append(
                {
                    "task_name": task_name,
                    "due_date": formatted_due_date,
                    "date_message": date_message,
                }
            )
    print("Check due tasks completed!!!")

    return email_data
