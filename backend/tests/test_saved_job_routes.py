"""File to test api endpoints for saved jobs"""
import pytest


@pytest.mark.usefixtures("database")
def test_get_all_saved_jobs(client):
    response = client.get('/api/saved-jobs')
    assert response.status_code == 200
    assert response.json == []

@pytest.mark.usefixtures("database")
def test_create_saved_job(client):
    data = {
        "jobTitle": "job1",
        "companyName": "company1",
        "location": "location1",
        "jobDescription": "description1",
        "additionalInfo": "info1",
        "salary": "salary1",
        "jobUrl": "url1",
        "jobDate": "date1"
    }

    response = client.post('/api/saved-jobs', json=data)
    assert response.status_code == 200
    assert response.json["id"] == 1
    assert response.json["job_title"] == "job1"
    assert response.json["company_name"] == "company1"
    assert response.json["location"] == "location1"
    assert response.json["job_description"] == "description1"
    assert response.json["additional_info"] == "info1"
    assert response.json["salary"] == "salary1"
    assert response.json["job_url"] == "url1"
    assert response.json["job_date"] == "date1"
