from datetime import datetime, timedelta
from app.script.utils import connectDB

def check_due_tasks(tasks):
    res = []
    for task in tasks:
        task_name = task[2]
        due_date = task[3]
        reminder_date = task[6] #no of days before due date to send reminder
        is_notify_email = task[7]
        is_notify_on_website = task[8]

        #check if current date + reminder_date is equal to due_date
        expected_date = due_date - timedelta(days=reminder_date)
        current_date = datetime.now()

        if (expected_date.year == current_date.year and expected_date.month == current_date.month and expected_date.day == current_date.day):
            if reminder_date == 1:
                date_message = 'tomorrow'
            elif reminder_date == 7:
                date_message = 'in a week'
            else:
                date_message = f'in {reminder_date} days'
            data = {
                'task_name': task_name,
                'due_date': due_date,
                'is_notify_email': is_notify_email,
                'is_notify_on_website': is_notify_on_website,
                'date_message': date_message
            }
            res.append(data)

    return res

def fetch_all_tasks(connection, cursor):
    #get all tasks which are not completed and is_reminder_enabled is true and due_date is not null
    query = 'SELECT * FROM tasks WHERE is_completed = false AND is_reminder_enabled = true AND due_date IS NOT NULL'
    cursor.execute(query)
    connection.commit()
    tasks = cursor.fetchall()
    return tasks

def create_notification(connection, cursor, task_name, due_date, date_message):
    cursor.execute(
        "INSERT INTO notifications (message, created_at, is_read) VALUES (%s, CURRENT_TIMESTAMP, %s)",
        (f'Task: {task_name} is due {date_message} on {due_date}.', 0)
    )
    connection.commit()

if __name__ == '__main__':
    connection = connectDB()
    cursor = connection.cursor()

    tasks = fetch_all_tasks(connection, cursor)
    due_tasks = check_due_tasks(tasks)

    for task in due_tasks:
        task_name = task['task_name']
        due_date = task['due_date']
        is_notify_email = task['is_notify_email']
        is_notify_on_website = task['is_notify_on_website']
        date_message = task['date_message']

        #format due date in format dd/mm/yyyy
        formatted_due_date = due_date.strftime('%d/%m/%Y')

        if is_notify_on_website:
            create_notification(connection, cursor, task_name, formatted_due_date, date_message)