import pytest
from app.model import ApplicationStage

API_ENDPOINT = "/api/application-stages"


@pytest.fixture
def setup_data(database):
    application_stages = [
        ApplicationStage(id=1, stage_name="Applied", position=0),
        ApplicationStage(id=2, stage_name="O.A.", position=1),
        ApplicationStage(id=3, stage_name="Interviewing", position=2),
        ApplicationStage(id=4, stage_name="Offer", position=3),
        ApplicationStage(id=5, stage_name="Rejected", position=4),
    ]
    # populate the database with application stages
    database.session.add_all(application_stages)
    database.session.commit()


@pytest.mark.usefixtures("database")
def test_get_all_stages(client):
    res = client.get(API_ENDPOINT)

    assert res.status_code == 200
    assert res.json == [
        {"id": 1, "stage_name": "Applied", "position": 0, "jobs": []},
        {"id": 2, "stage_name": "O.A.", "position": 1, "jobs": []},
        {"id": 3, "stage_name": "Interviewing", "position": 2, "jobs": []},
        {"id": 4, "stage_name": "Offer", "position": 3, "jobs": []},
        {"id": 5, "stage_name": "Rejected", "position": 4, "jobs": []},
    ]


@pytest.mark.usefixtures("database")
def test_update_stage_order(client, setup_data):
    stage_positions = [
        {"id": 2, "position": 0},
        {"id": 1, "position": 1},
        {"id": 3, "position": 2},
        {"id": 4, "position": 3},
        {"id": 5, "position": 4},
    ]
    res = client.put(
        f"{API_ENDPOINT}/reorder-stages", json={"stagePositions": stage_positions}
    )

    assert res.status_code == 200
    assert res.json == [
        {"id": 2, "stage_name": "O.A.", "position": 0, "jobs": []},
        {"id": 1, "stage_name": "Applied", "position": 1, "jobs": []},
        {"id": 3, "stage_name": "Interviewing", "position": 2, "jobs": []},
        {"id": 4, "stage_name": "Offer", "position": 3, "jobs": []},
        {"id": 5, "stage_name": "Rejected", "position": 4, "jobs": []},
    ]
