import pytest
from app.model import Contact

API_ENDPOINT = "/api/contacts"


@pytest.fixture
def setup_data(database):
    contact = Contact(
        id=1,
        job_id=1,
        person_name="John Doe",
        person_position="Software Developer",
        person_linkedin="https://www.linkedin.com/in/johndoe",
        person_email="",
        note="This is a note",
    )
    database.session.add(contact)
    database.session.commit()


@pytest.mark.usefixtures("database")
def test_create_contact(client):
    contact = {
        "jobId": 1,
        "personName": "John Doe",
        "personPosition": "Software Developer",
        "personLinkedin": "https://www.linkedin.com/in/johndoe",
        "personEmail": "",
        "note": "This is a note",
    }
    res = client.post(API_ENDPOINT, json=contact)

    assert res.status_code == 200
    assert res.json == {
        "id": 1,
        "job_id": 1,
        "person_name": "John Doe",
        "person_position": "Software Developer",
        "person_linkedin": "https://www.linkedin.com/in/johndoe",
        "person_email": "",
        "note": "This is a note",
    }


@pytest.mark.usefixtures("database")
def test_get_contact(client, setup_data):
    res = client.get(API_ENDPOINT)

    assert res.status_code == 200
    assert res.json == [
        {
            "id": 1,
            "job_id": 1,
            "person_name": "John Doe",
            "person_position": "Software Developer",
            "person_linkedin": "https://www.linkedin.com/in/johndoe",
            "person_email": "",
            "note": "This is a note",
        }
    ]


@pytest.mark.usefixtures("database")
def test_edit_contact(client, setup_data):
    contact = {
        "personName": "Jane Doe",
        "personPosition": "Software Developer",
        "personLinkedin": "https://www.linkedin.com/in/janedoe",
        "personEmail": "",
        "note": "This is an updated note",
    }

    res = client.put("/api/contacts/1", json=contact)

    assert res.status_code == 200
    assert res.json == {
        "id": 1,
        "job_id": 1,
        "person_name": "Jane Doe",
        "person_position": "Software Developer",
        "person_linkedin": "https://www.linkedin.com/in/janedoe",
        "person_email": "",
        "note": "This is an updated note",
    }


@pytest.mark.usefixtures("database")
def test_delete_contact(client, setup_data):
    res = client.delete("/api/contacts/1")

    assert res.status_code == 200
    assert res.json == "deleted contact successfully"
