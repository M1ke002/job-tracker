from unittest.mock import patch
from app.service.saved_job_service import update_job_stage, remove_job_from_stage
from app.model import SavedJob, ApplicationStage
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


@pytest.fixture(scope="function")
def mock_application_stage():
    mock_application_stage = patch("app.service.saved_job_service.ApplicationStage").start()
    yield mock_application_stage
    mock_application_stage.stop()


@pytest.mark.parametrize(
    "stage_name, has_rejected_at_stage",
    [
        ("Offer", True),
        ("Rejected", False),
        ("Rejected", True),
    ],
)
def test_update_job_stage_successful(mock_saved_job, mock_application_stage, mock_db, stage_name, has_rejected_at_stage):
    # init default job and stage based on params
    job = SavedJob(id=1, position=0)
    if has_rejected_at_stage:
        job.rejected_at_stage_id = 1
    else:
        job.rejected_at_stage_id = None
    stage = ApplicationStage(id=1, stage_name=stage_name, jobs=[SavedJob(), SavedJob()])
    stage_apply = ApplicationStage(id=1, stage_name="Applied", jobs=[SavedJob()])

    # mock the return value of the SavedJob.query.get method
    mock_saved_job.query.get.return_value = job

    # mock the return value of the ApplicationStage.query.filter_by method
    mock_application_stage.query.filter_by.return_value.first.side_effect = [
        stage,
        stage_apply,
    ]

    updated_job = update_job_stage(job_id=job.id, stage_id=stage.id)

    assert updated_job["stage_id"] == stage.id
    assert updated_job["position"] == len(stage.jobs)
    if stage_name == "Rejected":
        if has_rejected_at_stage:
            # if job already has rejected_at_stage_id, it must not be changed
            assert updated_job["rejected_at_stage_id"] == job.rejected_at_stage_id
        else:
            # if job doesnt have rejected_at_stage_id, set it to the default stage with name = 'Applied'
            assert updated_job["rejected_at_stage_id"] == stage_apply.id
    else:
        assert updated_job["rejected_at_stage_id"] == stage.id

    mock_db.session.commit.assert_called_once()


def test_update_job_stage_to_none(mock_saved_job, mock_application_stage, mock_db):
    job = SavedJob(id=1, stage_id=1, rejected_at_stage_id=1, position=0)
    stage = ApplicationStage(id=3, stage_name="Offer", jobs=[SavedJob(), SavedJob()])

    # mock the return value of the SavedJob.query.get method
    mock_saved_job.query.get.return_value = job

    # mock the return value of the ApplicationStage.query.filter_by method
    mock_application_stage.query.filter_by.return_value.first.return_value = stage

    updated_job = update_job_stage(job_id=1, stage_id="None")

    assert updated_job["stage_id"] is None
    assert updated_job["rejected_at_stage_id"] is None
    assert updated_job["position"] == 0

    mock_db.session.commit.assert_called_once()


@pytest.mark.parametrize(
    "is_job_found, is_stage_found",
    [
        (False, True),
        (True, False),
    ],
)
def test_update_job_stage_unsuccessful(mock_saved_job, mock_application_stage, mock_db, is_job_found, is_stage_found):
    if is_job_found:
        job = SavedJob(id=1, stage_id=1, rejected_at_stage_id=1, position=0)
    else:
        job = None

    if is_stage_found:
        stage = ApplicationStage(id=3, stage_name="Offer", jobs=[])
    else:
        stage = None

    # mock the return value of the SavedJob.query.get method
    mock_saved_job.query.get.return_value = job

    # mock the return value of the ApplicationStage.query.filter_by method
    mock_application_stage.query.filter_by.return_value.first.return_value = stage

    updated_job = update_job_stage(job_id=1, stage_id=3)
    assert updated_job is None

    mock_db.session.commit.assert_not_called()


# --------------------------test remove job from stage--------------------------
def test_remove_job_from_stage_successful(mock_saved_job, mock_db):
    saved_jobs = [
        SavedJob(id=1, stage_id=1, rejected_at_stage_id=1, position=1),
        SavedJob(id=2, stage_id=1, rejected_at_stage_id=1, position=0),
    ]

    # remove stage_id from job with id = 1
    # remaining jobs in stage
    job_positions = [
        {"id": 2, "stage_id": 1, "rejected_at_stage_id": 1, "position": 0},
    ]

    # mock the return value of the SavedJob.query.get method
    mock_saved_job.query.get.side_effect = [saved_jobs[0], saved_jobs[1]]

    result = remove_job_from_stage(job_id=1, job_positions=job_positions)

    for updated_job in result:
        # find the job position with the same id
        job_position = next((job for job in job_positions if job["id"] == updated_job["id"]), None)
        assert updated_job["position"] == job_position["position"]

    mock_db.session.commit.assert_called_once()


def test_remove_job_from_stage_unsuccessful(mock_saved_job, mock_db):
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
    mock_saved_job.query.get.side_effect = lambda id: (saved_jobs[id - 1] if id in [1, 2] else None)

    result = remove_job_from_stage(job_id=1, job_positions=job_positions)
    assert result is None
    mock_db.session.commit.assert_not_called()
