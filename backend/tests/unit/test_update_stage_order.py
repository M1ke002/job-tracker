# unit test the update_stage_order function
from unittest.mock import patch
from app.service.application_stage_service import update_stage_order
from app.model import ApplicationStage
import pytest


@pytest.fixture(scope="function")
def mock_application_stage():
    mock_application_stage = patch("app.service.application_stage_service.ApplicationStage").start()
    yield mock_application_stage
    mock_application_stage.stop()


@pytest.fixture(scope="function")
def mock_db():
    mock_db = patch("app.service.application_stage_service.db").start()
    yield mock_db
    mock_db.stop()


def test_successful_update(mock_application_stage, mock_db):
    application_stages = [
        ApplicationStage(id=1, stage_name="Applied", position=0),
        ApplicationStage(id=2, stage_name="Phone Screen", position=1),
        ApplicationStage(id=3, stage_name="Onsite", position=2),
    ]

    stage_positions = [
        {"id": 2, "position": 0},
        {"id": 1, "position": 1},
        {"id": 3, "position": 2},
    ]

    # mock the return value of the ApplicationStage.query.get method
    mock_application_stage.query.get.side_effect = lambda id: application_stages[id - 1]

    result = update_stage_order(stage_positions)

    # check the applied stage positions
    for updated_application_stage in result:
        # find the stage position with the same id
        stage_position = next(
            (stage for stage in stage_positions if stage["id"] == updated_application_stage["id"]),
            None,
        )
        assert updated_application_stage["position"] == stage_position["position"]

    # check if the db.session.commit method is called
    mock_db.session.commit.assert_called_once()


def test_unsuccessful_update(mock_application_stage, mock_db):
    application_stages = [
        ApplicationStage(id=1, stage_name="Applied", position=0),
        ApplicationStage(id=2, stage_name="Phone Screen", position=1),
        ApplicationStage(id=3, stage_name="Onsite", position=2),
    ]

    stage_positions = [
        {"id": 2, "position": 0},
        {"id": 1, "position": 1},
        {"id": 4, "position": 2},
    ]

    # mock the return value of the ApplicationStage.query.get method
    mock_application_stage.query.get.side_effect = lambda id: (application_stages[id - 1] if id in [1, 2, 3] else None)

    result = update_stage_order(stage_positions)

    # result contains None if the stage id is not found
    assert result is None
