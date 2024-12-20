import os
from dotenv import load_dotenv

import smtplib
from email.mime.text import MIMEText

from app.utils.utils import utc_to_sydney_time
from app.utils.utils import get_current_utc_time
from app.utils.utils import filter_jobs_by_keywords
from app.utils.utils import get_all_jobs_data

load_dotenv()


def should_send_email(email_data):
    # not send email if there are no due tasks and no new jobs
    should_send_email = False

    for key, value in email_data.items():
        if len(value) > 0:
            should_send_email = True
            break

    return should_send_email


def create_subject_and_body(email_data, keywords_in_title=[]):
    subject = ""
    body = ""

    has_previous_data = False

    now = get_current_utc_time()  # UTC time
    local_time = utc_to_sydney_time(now)
    local_time_dt_string = local_time.strftime("%d/%m/%Y %H:%M:%S")
    body += f"Scheduled job ran at {local_time_dt_string}.\n\n"

    for key, value in email_data.items():
        if len(value) == 0:
            continue

        if key == "web_scraper":
            subject += "Found"
            found_jobs = False
            has_previous_data = True

            # display the filtered jobs with keywords in title
            if len(keywords_in_title) > 0:
                all_jobs = get_all_jobs_data(value)
                filtered_jobs = filter_jobs_by_keywords(all_jobs, keywords_in_title)

                body += f"{len(filtered_jobs)} jobs containing {keywords_in_title} in title.\n"

                for job in filtered_jobs:
                    body += f"{job['job_title']} - {job['job_url']}\n"

                body += "\n"

            # value: array of obj: {site_name: [jobs]}
            for site_data in value:
                site_name = site_data["site_name"]
                jobs = site_data["jobs"]
                if found_jobs:
                    subject += ","
                subject += f" {len(jobs)} new jobs for {site_name}"

                if found_jobs:
                    body += "\n"
                body += f"{site_name}:\n"
                for job in jobs:
                    body += f"{job['job_title']} - {job['job_url']}\n"

                found_jobs = True

        if key == "tasks":
            if has_previous_data:
                subject += ". "
                body += "\n"

            subject += f"{len(value)} due tasks found"
            body += "Due tasks:\n"

            for task in value:
                body += f"Task: {task['task_name']} is due {task['date_message']} on {task['due_date']}.\n"

    subject += "."
    return subject, body


def send_mail(sender, password, recipients, subject, body):
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = ", ".join(recipients)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp_server:
        smtp_server.login(sender, password)
        smtp_server.sendmail(sender, recipients, msg.as_string())
    print("Message sent!")


if __name__ == "__main__":
    GMAIL_USERNAME = os.getenv("GMAIL_USERNAME")
    GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")
    subject = "Test email"
    body = "This is a test email from Python"
    send_mail(GMAIL_USERNAME, GMAIL_APP_PASSWORD, [GMAIL_USERNAME], subject, body)
