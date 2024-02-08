from app.utils.scraper.constants import BASE_URL_GRAD_CONNECTION, BASE_URL_SEEK
from app.utils.scraper.url_builder import ausgradUrlBuilder, seekUrlBuilder
import pytest

def test_ausgradUrlBuilder_default():
    url = ausgradUrlBuilder("", "", "", "")
    expected_url = BASE_URL_GRAD_CONNECTION + "/jobs/engineering-software/?ordering=-recent_job_created"
    assert url == expected_url

@pytest.mark.parametrize(
    "keyword, jobType, classification, location, expected_url",
    [
        ("software engineer", "internships", "", "sydney", BASE_URL_GRAD_CONNECTION + "/internships/engineering-software/sydney/?title=software+engineer&ordering=-recent_job_created"),
        ("", "", "computer-science", "", BASE_URL_GRAD_CONNECTION + "/jobs/computer-science/?ordering=-recent_job_created"),
        ("software", "graduate jobs", "computer-science", "Sydney", BASE_URL_GRAD_CONNECTION + "/graduate-jobs/computer-science/sydney/?title=software&ordering=-recent_job_created")
    ]
)
def test_ausgradUrlBuilder_with_parameters(keyword, jobType, classification, location, expected_url):
    url = ausgradUrlBuilder(keyword, jobType, classification, location)
    assert url == expected_url


def test_seekUrlBuilder_default():
    url = seekUrlBuilder("", "", "", "")
    expected_url = BASE_URL_SEEK + "/jobs-in-information-communication-technology?sortmode=ListedDate"
    assert url == expected_url

@pytest.mark.parametrize(
    "keyword, jobType, classification, location, expected_url",
    [
        ("software engineer", "full time", "", "All Australia", BASE_URL_SEEK + "/software-engineer-jobs-in-information-communication-technology/in-All-Australia/full-time?sortmode=ListedDate"),
        ("", "", "computer-science", "", BASE_URL_SEEK + "/jobs-in-computer-science?sortmode=ListedDate"),
        ("software", "part time", "computer-science", "All Sydney NSW", BASE_URL_SEEK + "/software-jobs-in-computer-science/in-All-Sydney-NSW/part-time?sortmode=ListedDate")
    ]
)
def test_seekUrlBuilder_with_parameters(keyword, jobType, classification, location, expected_url):
    url = seekUrlBuilder(keyword, jobType, classification, location)
    assert url == expected_url

