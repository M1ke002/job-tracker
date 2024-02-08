from .constants import BASE_URL_GRAD_CONNECTION, BASE_URL_SEEK

"""
    keyword: string. ex: "software engineer"
    jobType: string. ex: "internships / graduate jobs". default: "all" - all job types, displayed as (jobs)
    classification: string. ex: "engineering-software". default: "engineering-software"
    location: string. ex: "sydney". default: "australia"
"""
def ausgradUrlBuilder(keyword, jobType, classification, location):
    url = BASE_URL_GRAD_CONNECTION + "/"

    if (jobType == ""): jobType = "all"
    if (jobType == "all"): jobType = "jobs"
    url += jobType.replace(" ", "-") + "/"

    if (classification == ""): classification = "engineering-software"
    url += classification.replace(" ", "-") + "/"

    if (location != ""): url += location.lower() + "/"

    if (keyword != ""): url += "?title=" + keyword.replace(" ", "+")
    if (keyword != ""): url += "&"
    else: url += "?"

    url += "ordering=-recent_job_created"
    return url

"""
    keyword: string. ex: "software engineer"
    jobType: string. ex: "full time / part time". default: "all"
    classification: string. ex: "information-communication-technology". default: "information-communication-technology"
    location: string. ex: "All Australia / All Sydney NSW / All Melbourne VIC". default: ""
"""
def seekUrlBuilder(keyword, jobType, classification, location):
    url = BASE_URL_SEEK + "/"
    if (keyword != ""): url += keyword.replace(" ", "-") + "-jobs"
    else: url += "jobs"

    if (classification == ""): classification = "information-communication-technology"
    url += "-in-" + classification.lower().replace(" ", "-")

    if (location != ""): url += "/in-" + location.replace(" ", "-")

    if (jobType == ""): jobType = "all"
    if (jobType != "all"): url += "/" + jobType.lower().replace(" ", "-")

    url += "?sortmode=ListedDate"
    return url