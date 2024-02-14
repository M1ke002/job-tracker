import pytest
from unittest.mock import patch
from app.scripts.tasks import check_due_tasks
from app.model import Task, Notification
from datetime import datetime


@pytest.fixture
def setup_data(database):
    tasks = [
        Task(
            id=1,
            job_id=1,
            task_name="task1",
            due_date=datetime.strptime("2024-02-18", "%Y-%m-%d"),
            is_completed=False,
            is_reminder_enabled=True,
            is_reminded=False,
            reminder_date=1,
            is_notify_email=True,
            is_notify_on_website=True,
        ),
        Task(
            id=2,
            job_id=1,
            task_name="task2",
            due_date=datetime.strptime("2024-02-15", "%Y-%m-%d"),
            is_completed=False,
            is_reminder_enabled=True,
            is_reminded=False,
            reminder_date=1,
            is_notify_email=True,
            is_notify_on_website=True,
        ),
        Task(
            id=3,
            job_id=1,
            task_name="task3",
            due_date=datetime.strptime("2024-02-21", "%Y-%m-%d"),
            is_completed=False,
            is_reminder_enabled=True,
            is_reminded=False,
            reminder_date=7,
            is_notify_email=True,
            is_notify_on_website=True,
        ),
    ]

    database.session.add_all(tasks)
    database.session.commit()


@pytest.fixture
def mock_datetime():
    mock_datetime = patch("app.scripts.tasks.remind_tasks.datetime").start()
    yield mock_datetime
    mock_datetime.stop()


@pytest.mark.asyncio
@pytest.mark.usefixtures("setup_data")
# patch datetime.now to return a specific date
async def test_check_due_tasks(database, mock_datetime):
    # mock the current date
    current_date = datetime.strptime("2024-02-14", "%Y-%m-%d")
    mock_datetime.now.return_value = current_date

    email_data = await check_due_tasks(database.session)

    # check the returned email data
    assert email_data["type"] == "tasks"
    # only 2/3 tasks are due, since task1 is not due yet
    assert len(email_data["data"]) == 2

    assert email_data["data"][0] == {
        "task_name": "task2",
        "due_date": "15/02/2024",
        "date_message": "tomorrow",
    }

    assert email_data["data"][1] == {
        "task_name": "task3",
        "due_date": "21/02/2024",
        "date_message": "in a week",
    }

    # check the tasks in the database
    tasks = database.session.query(Task).all()

    for task in tasks:
        if task.id == 1:
            assert task.is_reminded == False
        else:
            assert task.is_reminded == True

    # check the notifications
    notifications = database.session.query(Notification).all()
    assert len(notifications) == 2
