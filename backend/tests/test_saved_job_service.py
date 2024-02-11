from unittest.mock import patch
from app.service.saved_job_service import update_job_order
from app.model import SavedJob
import pytest


@pytest.fixture(scope="function")
def mock_saved_job():
    mock_saved_job = patch("app.service.saved_job_service.SavedJob").start()
    yield mock_saved_job
    mock_saved_job.stop()


@pytest.fixture(scope="function")
def mock_db():
    mock_db = patch("app.service.saved_job_service.db").start()
    yield mock_db
    mock_db.stop()


def test_update_job_order_same_stage(mock_saved_job, mock_db):
    saved_jobs = [
        SavedJob(id=1, stage_id=1, rejected_at_stage_id=1, position=2),
        SavedJob(id=2, stage_id=1, rejected_at_stage_id=1, position=0),
        SavedJob(id=3, stage_id=1, rejected_at_stage_id=1, position=1),
    ]

    job_positions = [
        {"id": 1, "stage_id": 1, "rejected_at_stage_id": 1, "position": 0},
        {"id": 2, "stage_id": 1, "rejected_at_stage_id": 1, "position": 1},
        {"id": 3, "stage_id": 1, "rejected_at_stage_id": 1, "position": 2},
    ]

    # mock the return value of the SavedJob.query.get method
    mock_saved_job.query.get.side_effect = lambda id: saved_jobs[id - 1]

    result = update_job_order(job_positions)

    for updated_job in result:
        # find the job position with the same id
        job_position = next(
            (job for job in job_positions if job["id"] == updated_job["id"]), None
        )
        assert updated_job["position"] == job_position["position"]
        assert updated_job["stage_id"] == job_position["stage_id"]

    mock_db.session.commit.assert_called_once()


def test_update_job_order_different_stage(mock_saved_job, mock_db):
    saved_jobs = [
        SavedJob(id=1, stage_id=1, rejected_at_stage_id=1, position=2),
        SavedJob(id=2, stage_id=1, rejected_at_stage_id=1, position=0),
        SavedJob(id=3, stage_id=1, rejected_at_stage_id=1, position=1),
    ]

    # move saved_job with id = 3 to stage with id = 2
    job_positions = [
        {"id": 1, "stage_id": 1, "rejected_at_stage_id": 1, "position": 1},
        {"id": 2, "stage_id": 1, "rejected_at_stage_id": 1, "position": 0},
        {"id": 3, "stage_id": 2, "rejected_at_stage_id": 2, "position": 0},
    ]

    # mock the return value of the SavedJob.query.get method
    mock_saved_job.query.get.side_effect = lambda id: saved_jobs[id - 1]

    result = update_job_order(job_positions)

    for updated_job in result:
        # find the job position with the same id
        job_position = next(
            (job for job in job_positions if job["id"] == updated_job["id"]), None
        )
        assert updated_job["position"] == job_position["position"]
        assert updated_job["stage_id"] == job_position["stage_id"]

    mock_db.session.commit.assert_called_once()


def test_update_job_order_unsuccessful(mock_saved_job, mock_db):
    saved_jobs = [
        SavedJob(id=1, stage_id=1, rejected_at_stage_id=1, position=1),
        SavedJob(id=2, stage_id=1, rejected_at_stage_id=1, position=0),
    ]

    # job with id = 3 is not found
    job_positions = [
        {"id": 1, "stage_id": 1, "rejected_at_stage_id": 1, "position": 0},
        {"id": 3, "stage_id": 1, "rejected_at_stage_id": 1, "position": 1},
    ]

    # mock the return value of the SavedJob.query.get method
    mock_saved_job.query.get.side_effect = lambda id: (
        saved_jobs[id - 1] if id in [1, 2] else None
    )

    result = update_job_order(job_positions)
    assert result is None
    mock_db.session.commit.assert_not_called()
