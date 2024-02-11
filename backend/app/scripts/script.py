import os
import sys

# print the system path
# append the path to the 'backend' folder to the system path
sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))

import asyncio
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import Config
from app.scripts.check_due_tasks import check_due_tasks
from app.scripts.web_scraper import web_scraper
from app.utils.send_mail.send_mail import (
    should_send_email,
    create_subject_and_body,
    send_mail,
)


def construct_and_send_email(email_data):
    GMAIL_USERNAME = os.getenv("GMAIL_USERNAME")
    GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")

    if not should_send_email(email_data):
        print("No email to send", email_data)
        return

    subject, body = create_subject_and_body(email_data)
    # print(subject)
    # print(body)

    send_mail(GMAIL_USERNAME, GMAIL_APP_PASSWORD, [GMAIL_USERNAME], subject, body)


def create_sqlalchemy_session():
    engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)
    Session = sessionmaker(bind=engine)
    session = Session()
    return session


async def main():
    session = create_sqlalchemy_session()
    email_data = {}

    # scrape schedule
    data = await web_scraper(session)
    email_data[data["type"]] = data["data"]

    # check due tasks
    data = check_due_tasks(session)
    email_data[data["type"]] = data["data"]

    # send email
    construct_and_send_email(email_data)


if __name__ == "__main__":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
