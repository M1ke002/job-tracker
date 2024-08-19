from flask import Blueprint, jsonify, request

from app.service.scraped_site_service import get_all_scraped_sites
from app.service.scraped_site_service import get_scraped_site
from app.service.scraped_site_service import scrape_site

from app.service.job_listing_service import search_job_listings
from app.service.job_listing_service import get_new_job_listings
from app.service.job_listing_service import create_job_listings_for_site

scraped_site_routes = Blueprint("scraped_site_routes", __name__)


# get all scraped sites
@scraped_site_routes.route("", methods=["GET"])
def handle_get_all_scraped_sites():
    # arr of dicts
    scrapedSites = get_all_scraped_sites()

    return jsonify(scrapedSites), 200


# get a scraped site
@scraped_site_routes.route("/<int:scraped_site_id>", methods=["GET"])
def handle_get_scraped_site(scraped_site_id):
    scrapedSite = get_scraped_site(scraped_site_id)
    if scrapedSite is None:
        return jsonify({"error": "Scraped site not found"}), 404

    return jsonify(scrapedSite), 200


# get job listings for a scraped site, with search and pagination
# sample request: http://localhost:5000/api/scraped-sites/1/jobs?page=1&per_page=30&search=intern
@scraped_site_routes.route("/<int:scraped_site_id>/jobs", methods=["GET"])
def handle_get_job_listings(scraped_site_id):
    page = request.args.get("page", default=1, type=int)
    per_page = request.args.get("per_page", default=30, type=int)
    query = request.args.get("search", default="", type=str)

    # job_listings, total_pages, total_job_count = get_all_job_listings_paginated(scraped_site_id, page, per_page)
    job_listings, total_pages, total_job_count = search_job_listings(scraped_site_id, query, page, per_page)

    response = {"job_listings": job_listings, "total_pages": total_pages, "total_job_count": total_job_count}
    return jsonify(response), 200


# edit a scraped site
@scraped_site_routes.route("/<int:scraped_site_id>", methods=["PUT"])
def handle_edit_scraped_site(scraped_site_id):
    return "edit a scraped site"


# scrape a site
@scraped_site_routes.route("/<int:scraped_site_id>/scrape", methods=["GET"])
async def handle_scrape_site(scraped_site_id):
    # call fn getAllJobListings to scrape newest job listings
    # compare scraped job listings with existing job listings in db
    # find new job listings
    # update db with scraped job listings

    scraped_jobs = await scrape_site(scraped_site_id)
    if scraped_jobs is None:
        return jsonify({"error": "Something wrong while scraping site"}), 400

    new_jobs = get_new_job_listings(scraped_site_id, scraped_jobs)

    create_job_listings_for_site(scraped_site_id, new_jobs)

    # get new scraped site
    updated_scraped_site = get_scraped_site(scraped_site_id)
    if updated_scraped_site is None:
        return jsonify({"error": "Cant find scraped site"}), 400

    return jsonify(updated_scraped_site), 200
