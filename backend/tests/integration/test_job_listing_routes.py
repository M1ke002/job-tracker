import pytest
from app.model import JobListing

API_ENDPOINT = "/api/job-listings"


@pytest.fixture
def setup_data(database):
    job_listings = [
        JobListing(
            id=1,
            scraped_site_id=1,
            job_title="Software Engineer",
            company_name="Google",
            job_url="https://www.google.com",
        ),
        JobListing(
            id=2,
            scraped_site_id=1,
            job_title="Data Scientist",
            company_name="Facebook",
            job_url="https://www.facebook.com",
        ),
        JobListing(
            id=3,
            scraped_site_id=1,
            job_title="Product Manager",
            company_name="Amazon",
            job_url="https://www.amazon.com",
        ),
        JobListing(
            id=4,
            scraped_site_id=1,
            job_title="Software Engineer",
            company_name="Microsoft",
            job_url="https://www.microsoft.com",
        ),
        JobListing(
            id=5,
            scraped_site_id=1,
            job_title="Data Scientist",
            company_name="Netflix",
            job_url="https://www.netflix.com",
        ),
        JobListing(
            id=6,
            scraped_site_id=1,
            job_title="Product Manager",
            company_name="Apple",
            job_url="https://www.apple.com",
        ),
    ]
    # populate the database with job listings
    database.session.add_all(job_listings)
    database.session.commit()


def test_get_all_job_listings(client, setup_data):
    response = client.get(f"{API_ENDPOINT}/1?page=1&per_page=2")
    data = response.json
    job_listings = data[0]
    total_pages = data[1]
    total_job_count = data[2]

    assert response.status_code == 200
    assert len(job_listings) == 2
    assert total_pages == 3
    assert total_job_count == 6

    response = client.get(f"{API_ENDPOINT}/1?page=1&per_page=7")
    data = response.json
    job_listings = data[0]
    total_pages = data[1]
    total_job_count = data[2]

    assert response.status_code == 200
    assert len(job_listings) == 6
    assert total_pages == 1
    assert total_job_count == 6


def test_search_job_listings(client, setup_data):
    response = client.get(f"{API_ENDPOINT}/1/search?query=software&page=1&per_page=2")
    data = response.json
    job_listings = data[0]
    total_pages = data[1]
    total_job_count = data[2]

    assert response.status_code == 200
    assert len(job_listings) == 2
    assert total_pages == 1
    assert total_job_count == 2

    # search for job listings that don't exist
    response = client.get(f"{API_ENDPOINT}/1/search?query=randomquerylol&page=1&per_page=2")
    data = response.json
    job_listings = data[0]
    total_pages = data[1]
    total_job_count = data[2]

    assert response.status_code == 200
    assert len(job_listings) == 0
    assert total_pages == 0
    assert total_job_count == 0

    # search for job listings with no query parameter
    response = client.get(f"{API_ENDPOINT}/1/search?page=1&per_page=2")
    data = response.json
    assert response.status_code == 400
