from .constants import BASE_URL_AUS_GRAD, BASE_URL_SEEK

"""
    keyword: string. ex: "software engineer"
    jobType: string. ex: "internships / graduate jobs". default: "all job types, displayed as (jobs)"
    discipline: string. ex: "engineering-software". default: "engineering-software"
    location: string. ex: "sydney". default: "australia"
"""
def ausgradUrlBuilder(keyword, jobType, discipline, location):
    url = BASE_URL_AUS_GRAD + "/"

    if (jobType == ""): jobType = "jobs"
    url += jobType.replace(" ", "-") + "/"

    if (discipline == ""): discipline = "engineering-software"
    url += discipline.replace(" ", "-") + "/"

    if (location != ""): url += location.lower() + "/"

    if (keyword != ""): url += "?title=" + keyword.replace(" ", "+")
    if (keyword != ""): url += "&"
    else: url += "?"

    url += "ordering=-recent_job_created"
    return url

"""
    keyword: string. ex: "software engineer"
    workType: string. ex: "full time / part time". default: ""
    classification: string. ex: "information-communication-technology". default: "information-communication-technology"
    location: string. ex: "All Australia / All Sydney NSW / All Melbourne VIC". default: ""
"""
def seekUrlBuilder(keyword, workType, classification, location):
    url = BASE_URL_SEEK + "/"
    if (keyword != ""): url += keyword.replace(" ", "-") + "-jobs"
    else: url += "jobs"

    if (classification == ""): classification = "information-communication-technology"
    url += "-in-" + classification.lower().replace(" ", "-")

    if (location != ""): url += "/in-" + location.replace(" ", "-")

    if (workType != ""): url += "/" + workType.lower().replace(" ", "-")

    url += "?sortmode=ListedDate"
    return url