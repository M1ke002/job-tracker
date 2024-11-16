from app.utils.send_mail.send_mail import should_send_email, create_subject_and_body


def test_should_send_email():
    email_data = {"web_scraper": [], "tasks": []}
    assert should_send_email(email_data) is False

    email_data = {
        "web_scraper": [{"site_name": "site1", "jobs": [{"job_title": "job1", "job_url": "url1"}]}],
        "tasks": [],
    }
    assert should_send_email(email_data) is True

    email_data = {
        "web_scraper": [],
        "tasks": [{"task_name": "task1", "due_date": "2021-01-01", "date_message": "today"}],
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
    task1_msg = "Task: task1 is due today on 2021-01-01."
    task2_msg = "Task: task2 is due tomorrow on 2021-01-02."

    assert subject == "2 due tasks found."
    assert task1_msg in body
    assert task2_msg in body


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

    site1_jobs = "site1:\njob1 - url1"
    site2_jobs = "site2:\njob2 - url2\njob3 - url3"

    assert subject == "Found 1 new jobs for site1, 2 new jobs for site2."
    assert site1_jobs in body
    assert site2_jobs in body

    email_data2 = {
        "web_scraper": [{"site_name": "site2", "jobs": [{"job_title": "job1", "job_url": "url1"}]}],
        "tasks": [],
    }
    subject, body = create_subject_and_body(email_data2)
    site2_jobs = "site2:\njob1 - url1"

    assert subject == "Found 1 new jobs for site2."
    assert site2_jobs in body


def test_create_subject_and_body_found_jobs_with_keywords_title():
    email_data1 = {
        "web_scraper": [
            {"site_name": "site1", "jobs": [{"job_title": "junior developer", "job_url": "url1"}]},
            {
                "site_name": "site2",
                "jobs": [
                    {"job_title": "web intern", "job_url": "url2"},
                    {"job_title": "job3", "job_url": "url3"},
                ],
            },
        ],
        "tasks": [],
    }
    keywords = ["junior", "intern"]
    subject, body = create_subject_and_body(email_data1, keywords)

    jobs_containing_keywords_msg = (
        f"2 jobs containing {keywords} in title.\n" f"junior developer - url1\n" f"web intern - url2\n\n"
    )
    site1_jobs = "site1:\njunior developer - url1"
    site2_jobs = "site2:\nweb intern - url2\njob3 - url3"

    assert subject == "Found 1 new jobs for site1, 2 new jobs for site2."
    assert jobs_containing_keywords_msg in body
    assert site1_jobs in body
    assert site2_jobs in body

    email_data2 = {
        "web_scraper": [{"site_name": "site2", "jobs": [{"job_title": "job1", "job_url": "url1"}]}],
        "tasks": [],
    }
    subject, body = create_subject_and_body(email_data2)
    site2_jobs = "site2:\njob1 - url1"

    assert subject == "Found 1 new jobs for site2."
    assert site2_jobs in body


def test_create_subject_and_body_not_found_jobs_with_keywords_title():
    email_data1 = {
        "web_scraper": [
            {"site_name": "site1", "jobs": [{"job_title": "junior developer", "job_url": "url1"}]},
            {
                "site_name": "site2",
                "jobs": [
                    {"job_title": "web intern", "job_url": "url2"},
                    {"job_title": "job3", "job_url": "url3"},
                ],
            },
        ],
        "tasks": [],
    }
    keywords = ["senior", "part time"]
    subject, body = create_subject_and_body(email_data1, keywords)

    jobs_containing_keywords_msg = f"0 jobs containing {keywords} in title.\n"
    site1_jobs = "site1:\njunior developer - url1"
    site2_jobs = "site2:\nweb intern - url2\njob3 - url3"

    assert subject == "Found 1 new jobs for site1, 2 new jobs for site2."
    assert jobs_containing_keywords_msg in body
    assert site1_jobs in body
    assert site2_jobs in body

    email_data2 = {
        "web_scraper": [{"site_name": "site2", "jobs": [{"job_title": "job1", "job_url": "url1"}]}],
        "tasks": [],
    }

    subject, body = create_subject_and_body(email_data2)
    site2_jobs = "site2:\njob1 - url1"

    assert subject == "Found 1 new jobs for site2."
    assert site2_jobs in body


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
    site1_jobs = "site1:\njob1 - url1"
    site2_jobs = "site2:\njob2 - url2\njob3 - url3"
    task1_msg = "Task: task1 is due today on 2021-01-01."
    task2_msg = "Task: task2 is due tomorrow on 2021-01-02."

    assert subject == "Found 1 new jobs for site1, 2 new jobs for site2. 2 due tasks found."
    # jobs containing keyword msg must not be found in email body
    assert "jobs containing" not in body
    assert site1_jobs in body
    assert site2_jobs in body
    assert task1_msg in body
    assert task2_msg in body
