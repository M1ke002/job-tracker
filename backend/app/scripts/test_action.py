import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import asyncio
from app.scripts.utils import create_sqlalchemy_session
from app.scripts.check_due_tasks import check_due_tasks
from app.scripts.scrape_schedule import scrape_schedule
from app.utils.send_mail.send_mail import should_send_email_v1, create_subject_and_body_v1, send_mail

if __name__ == '__main__':
    print("Working!")
