import os
from dotenv import load_dotenv

load_dotenv()
import smtplib
from email.mime.text import MIMEText

from datetime import datetime


"""
    input: jobs_dict. ex: {
        GRAD_CONNECTION: [list of jobs],
        SEEK: [list of jobs]
    }
    subject: Found x new jobs for site_name, y new jobs for site_name
    body: 
        Scheduled job ran at x.

        site_name:
            job_title - job_url
            job_title - job_url
            ...

        site_name:
            job_title - job_url
            job_title - job_url
            ...
"""
def create_subject_and_body(jobs_dict):
    subject = "Found"
    body = ""

    found_jobs = False

    now = datetime.now()
    dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
    body += f"Scheduled job ran at {dt_string}.\n\n"

    for site_name, jobs in jobs_dict.items():
        if (len(jobs) == 0): continue
        if (found_jobs):
            subject += ","
        subject += f" {len(jobs)} new jobs for {site_name}"

        if (found_jobs):
            body += "\n\n"
        body += f"{site_name}:\n"
        for job in jobs:
            body += f"{job['job_title']} - {job['job_url']}\n"

        found_jobs = True
    
    subject += "."
    return subject, body

def send_mail(sender, password, recipients, subject, body):
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = ", ".join(recipients)

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp_server:
       smtp_server.login(sender, password)
       smtp_server.sendmail(sender, recipients, msg.as_string())
    print("Message sent!")


if __name__ == "__main__":
    GMAIL_USERNAME = os.getenv('GMAIL_USERNAME')
    GMAIL_APP_PASSWORD = os.getenv('GMAIL_APP_PASSWORD')
    subject = "Test email"
    body = "This is a test email from Python"
    send_mail(
        GMAIL_USERNAME,
        GMAIL_APP_PASSWORD,
        [GMAIL_USERNAME],
        subject,
        body
    )