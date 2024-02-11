from unittest.mock import patch
import pytest
from app.model import SavedJob
from app.service.saved_job_service import is_similar_job_exists


@pytest.fixture(scope="function")
def mock_db():
    mock_db = patch("app.service.saved_job_service.db").start()
    yield mock_db
    mock_db.stop()


@pytest.fixture(scope="function")
def mock_saved_job():
    mock_saved_job = patch("app.service.saved_job_service.SavedJob").start()
    yield mock_saved_job
    mock_saved_job.stop()


def test_similar_job_exists(mock_saved_job):
    existing_job = SavedJob(
        id=1,
        job_title="Software Engineer",
        company_name="Google",
        job_url="www.google.com",
    )
    # mock the return value of the SavedJob.query.filter_by method
    mock_saved_job.query.filter_by.return_value.first.return_value = existing_job

    is_exist = is_similar_job_exists("Software Engineer", "Google", "www.google.com")
    assert is_exist is True

    is_exist = is_similar_job_exists("Software Engineer", "Google", "www.google.com", 2)
    assert is_exist is True
    mock_saved_job.stop()


def test_similar_job_not_exists(mock_saved_job):
    existing_job = SavedJob(
        id=2, job_title="Software Dev", company_name="Google", job_url="www.google.com"
    )
    # mock the return value of the SavedJob.query.filter_by method
    mock_saved_job.query.filter_by.return_value.first.return_value = None

    is_exist = is_similar_job_exists("Software Engineer", "Google", "www.google.com")
    assert is_exist is False

    mock_saved_job.query.filter_by.return_value.first.return_value = existing_job
    is_exist = is_similar_job_exists("Software Engineer", "Google", "www.google.com", 2)
    assert is_exist is False
