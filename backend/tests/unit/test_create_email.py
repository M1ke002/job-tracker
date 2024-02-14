from app.utils.send_mail.send_mail import should_send_email, create_subject_and_body


def test_should_send_email():
    email_data = {"web_scraper": [], "tasks": []}
    assert should_send_email(email_data) is False

    email_data = {
        "web_scraper": [
            {"site_name": "site1", "jobs": [{"job_title": "job1", "job_url": "url1"}]}
        ],
        "tasks": [],
    }
    assert should_send_email(email_data) is True

    email_data = {
        "web_scraper": [],
        "tasks": [
            {"task_name": "task1", "due_date": "2021-01-01", "date_message": "today"}
        ],
    }
    assert should_send_email(email_data) is True


def test_create_subject_and_body_with_tasks():
    email_data = {
        "web_scraper": [],
        "tasks": [
            {"task_name": "task1", "due_date": "2021-01-01", "date_message": "today"},
            {
                "task_name": "task2",
                "due_date": "2021-01-02",
                "date_message": "tomorrow",
            },
        ],
    }
    subject, body = create_subject_and_body(email_data)
    assert subject == "2 due tasks found."
    assert "Task: task1 is due today on 2021-01-01." in body
    assert "Task: task2 is due tomorrow on 2021-01-02." in body


def test_create_subject_and_body_with_web_scraper():
    email_data1 = {
        "web_scraper": [
            {"site_name": "site1", "jobs": [{"job_title": "job1", "job_url": "url1"}]},
            {
                "site_name": "site2",
                "jobs": [
                    {"job_title": "job2", "job_url": "url2"},
                    {"job_title": "job3", "job_url": "url3"},
                ],
            },
        ],
        "tasks": [],
    }
    subject, body = create_subject_and_body(email_data1)
    assert subject == "Found 1 new jobs for site1, 2 new jobs for site2."
    assert "site1:\njob1 - url1" in body
    assert "site2:\njob2 - url2\njob3 - url3" in body

    email_data2 = {
        "web_scraper": [
            {"site_name": "site2", "jobs": [{"job_title": "job1", "job_url": "url1"}]}
        ],
        "tasks": [],
    }
    subject, body = create_subject_and_body(email_data2)
    assert subject == "Found 1 new jobs for site2."
    assert "site2:\njob1 - url1" in body


def test_create_subject_and_body():
    email_data = {
        "web_scraper": [
            {"site_name": "site1", "jobs": [{"job_title": "job1", "job_url": "url1"}]},
            {
                "site_name": "site2",
                "jobs": [
                    {"job_title": "job2", "job_url": "url2"},
                    {"job_title": "job3", "job_url": "url3"},
                ],
            },
        ],
        "tasks": [
            {"task_name": "task1", "due_date": "2021-01-01", "date_message": "today"},
            {
                "task_name": "task2",
                "due_date": "2021-01-02",
                "date_message": "tomorrow",
            },
        ],
    }
    subject, body = create_subject_and_body(email_data)
    assert (
        subject
        == "Found 1 new jobs for site1, 2 new jobs for site2. 2 due tasks found."
    )
    assert "site1:\njob1 - url1" in body
    assert "site2:\njob2 - url2\njob3 - url3" in body
    assert "Task: task1 is due today on 2021-01-01." in body
    assert "Task: task2 is due tomorrow on 2021-01-02." in body
