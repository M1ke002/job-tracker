import pytest
from app.model import SavedJob, ApplicationStage

API_ENDPOINT = "/api/saved-jobs"


@pytest.fixture
def setup_data(database):
    saved_jobs = [
        SavedJob(
            id=1,
            job_title="Software Engineer",
            company_name="Google",
            job_url="www.google.com",
            stage_id=1,
            rejected_at_stage_id=1,
        ),
        SavedJob(
            id=2,
            job_title="Software Engineer",
            company_name="Facebook",
            job_url="www.facebook.com",
            stage_id=None,
            rejected_at_stage_id=None,
        ),
        SavedJob(
            id=3,
            job_title="Software Engineer",
            company_name="Amazon",
            job_url="www.amazon.com",
            stage_id=5,
            rejected_at_stage_id=3,
        ),
        SavedJob(
            id=4,
            job_title="Software Engineer",
            company_name="Apple",
            job_url="www.apple.com",
            stage_id=1,
            rejected_at_stage_id=1,
        ),
    ]

    application_stages = [
        ApplicationStage(id=1, stage_name="Applied", position=0, jobs=[saved_jobs[0], saved_jobs[3]]),
        ApplicationStage(id=2, stage_name="O.A.", position=1, jobs=[]),
        ApplicationStage(id=3, stage_name="Interview", position=2, jobs=[]),
        ApplicationStage(id=4, stage_name="Offer", position=3, jobs=[]),
        ApplicationStage(id=5, stage_name="Rejected", position=4, jobs=[saved_jobs[2]]),
    ]

    database.session.add_all(saved_jobs)
    database.session.add_all(application_stages)
    database.session.commit()


@pytest.mark.usefixtures("database")
def test_get_all_jobs(client, setup_data):
    res = client.get(API_ENDPOINT)

    assert res.status_code == 200
    assert len(res.json) == 4


@pytest.mark.usefixtures("database")
def test_get_job(client, setup_data):
    job_id = 1
    res = client.get(f"{API_ENDPOINT}/{job_id}")

    assert res.status_code == 200
    assert res.json["id"] == job_id
    assert res.json["job_title"] == "Software Engineer"
    assert res.json["company_name"] == "Google"
    assert res.json["job_url"] == "www.google.com"


@pytest.mark.usefixtures("database")
def test_create_job(client):
    job1 = {
        "jobTitle": "Software Engineer",
        "companyName": "Microsoft",
        "jobUrl": "www.microsoft.com",
    }

    res = client.post(API_ENDPOINT, json=job1)
    assert res.status_code == 200

    # missing job url
    job2 = {
        "jobTitle": "Software Engineer",
        "companyName": "Microsoft",
    }
    res = client.post(API_ENDPOINT, json=job2)
    assert res.status_code == 400


@pytest.mark.usefixtures("database")
def test_edit_job(client, setup_data):
    job_id = 1
    job = {
        "jobTitle": "Software Engineer",
        "companyName": "Microsoft",
        "jobUrl": "www.microsoft.com",
    }

    res = client.put(f"{API_ENDPOINT}/{job_id}", json=job)
    assert res.status_code == 200

    # missing job url
    job = {
        "jobTitle": "Software Engineer",
        "companyName": "Microsoft",
    }
    res = client.put(f"{API_ENDPOINT}/{job_id}", json=job)
    assert res.status_code == 400

    # job already exists
    job = {
        "jobTitle": "Software Engineer",
        "companyName": "Facebook",
        "jobUrl": "www.facebook.com",
    }
    res = client.put(f"{API_ENDPOINT}/{job_id}", json=job)
    assert res.status_code == 400


@pytest.mark.usefixtures("database")
def test_delete_saved_job(client, setup_data):
    job_id = 1
    res = client.delete(f"{API_ENDPOINT}/{job_id}")
    assert res.status_code == 200

    # job doesnt exist
    job_id = 100
    res = client.delete(f"{API_ENDPOINT}/{job_id}")
    assert res.status_code == 400


@pytest.mark.usefixtures("database")
def test_edit_saved_job_stage(client, setup_data):
    # move job with id = 2 to stage with id = 1 (Applied stage)
    job_id = 2
    stage_id = 1
    res = client.put(f"{API_ENDPOINT}/{job_id}/stage", json={"stageId": stage_id})
    assert res.status_code == 200
    assert res.json["stage_id"] == stage_id
    assert res.json["rejected_at_stage_id"] == stage_id
    assert res.json["position"] == 3


@pytest.mark.usefixtures("database")
def test_move_saved_job_stage_rejected(client, setup_data):
    # move job with id = 1 to rejected stage
    job_id = 1
    stage_id = 5
    res = client.put(f"{API_ENDPOINT}/{job_id}/stage", json={"stageId": stage_id})
    assert res.status_code == 200
    assert res.json["stage_id"] == stage_id
    assert res.json["rejected_at_stage_id"] == 1
    assert res.json["position"] == 2

    # move job with id = 2 (doesnt belong to any stages yet) to rejected stage
    job_id = 2
    stage_id = 5
    res = client.put(f"{API_ENDPOINT}/{job_id}/stage", json={"stageId": stage_id})
    assert res.status_code == 200
    assert res.json["stage_id"] == stage_id
    assert res.json["rejected_at_stage_id"] == 1
    assert res.json["position"] == 3

    # move job with id = 3 to None(no stage)
    job_id = 3
    stage_id = "None"
    res = client.put(f"{API_ENDPOINT}/{job_id}/stage", json={"stageId": stage_id})
    assert res.status_code == 200
    assert res.json["stage_id"] is None
    assert res.json["rejected_at_stage_id"] is None


@pytest.mark.usefixtures("database")
def test_edit_saved_job_stage_invalid(client, setup_data):
    # invalid stage id
    job_id = 2
    stage_id = 6
    res = client.put(f"{API_ENDPOINT}/{job_id}/stage", json={"stageId": stage_id})
    assert res.status_code == 400

    # invalid job id
    job_id = 100
    stage_id = 1
    res = client.put(f"{API_ENDPOINT}/{job_id}/stage", json={"stageId": stage_id})
    assert res.status_code == 400


@pytest.mark.usefixtures("database")
def test_update_job_order(client, setup_data):
    # reorder the jobs to new stages
    job_positions = [
        {"id": 1, "stage_id": 2, "position": 0, "rejected_at_stage_id": 2},
        {"id": 2, "stage_id": 2, "position": 1, "rejected_at_stage_id": 2},
        {"id": 3, "stage_id": 4, "position": 0, "rejected_at_stage_id": 4},
        {"id": 4, "stage_id": 5, "position": 0, "rejected_at_stage_id": 1},
    ]
    res = client.put(f"{API_ENDPOINT}/reorder-jobs", json={"jobPositions": job_positions})
    assert res.status_code == 200
    assert res.json[0]["position"] == 0
    assert res.json[0]["stage_id"] == 2
    assert res.json[0]["rejected_at_stage_id"] == 2

    assert res.json[1]["position"] == 1
    assert res.json[1]["stage_id"] == 2
    assert res.json[1]["rejected_at_stage_id"] == 2

    assert res.json[2]["position"] == 0
    assert res.json[2]["stage_id"] == 4
    assert res.json[2]["rejected_at_stage_id"] == 4

    assert res.json[3]["position"] == 0
    assert res.json[3]["stage_id"] == 5
    assert res.json[3]["rejected_at_stage_id"] == 1


@pytest.mark.usefixtures("database")
def test_remove_job_from_stage(client, setup_data):
    # remove job with id = 1 from stage
    job_id = 1
    job_positions = [{"id": 4, "stage_id": 1, "position": 0, "rejected_at_stage_id": 1}]
    res = client.put(f"{API_ENDPOINT}/{job_id}/remove-stage", json={"jobPositions": job_positions})
    assert res.status_code == 200
    assert res.json[0]["position"] == 0
    assert res.json[0]["stage_id"] == 1
    assert res.json[0]["rejected_at_stage_id"] == 1

    # remove job with id = 2 from stage. no remaining jobs in the same stage -> empty job_positions
    job_id = 2
    job_positions = []
    res = client.put(f"{API_ENDPOINT}/{job_id}/remove-stage", json={"jobPositions": job_positions})
    print(res.json)
    assert res.status_code == 200
    assert res.json == []
