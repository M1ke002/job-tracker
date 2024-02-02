import os 
import sys
#print the system path
#append the path to the 'backend' folder to the system path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

import asyncio
from app.scripts.utils import connectDB
from app.scripts.check_due_tasks import check_due_tasks
from app.scripts.scrape_schedule import scrape_schedule
from app.utils.send_mail.send_mail import should_send_email_v1, create_subject_and_body_v1, send_mail

def construct_and_send_email(email_data):
    GMAIL_USERNAME = os.getenv('GMAIL_USERNAME')
    GMAIL_APP_PASSWORD = os.getenv('GMAIL_APP_PASSWORD')

    if not should_send_email_v1(email_data):
        print("No email to send", email_data)
        return
    
    subject, body = create_subject_and_body_v1(email_data)
    # print(subject)
    # print(body)

    send_mail(
        GMAIL_USERNAME,
        GMAIL_APP_PASSWORD,
        [GMAIL_USERNAME],
        subject,
        body
    )


async def main():
    connection = connectDB()
    cursor = connection.cursor()
    email_data = {}

    #scrape schedule
    data = await scrape_schedule(connection, cursor)
    email_data[data['type']] = data['data']

    #check due tasks
    #TODO: bug with notifications for due tasks: notification model not suitable for tasks (has scraped_site_id field)
    data = check_due_tasks(connection, cursor)
    email_data[data['type']] = data['data']

    cursor.close()
    connection.close()

    #send email
    construct_and_send_email(email_data)

if __name__ == "__main__":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())