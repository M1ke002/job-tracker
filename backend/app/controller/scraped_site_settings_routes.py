from flask import Blueprint, request, jsonify

from app.service.scraped_site_settings_service import edit_scraped_site_settings

scraped_site_settings_routes = Blueprint('scraped_site_settings_routes', __name__)

# edit a scraped site setting
@scraped_site_settings_routes.route('/<int:scraped_site_setting_id>', methods=['PUT'])
def handle_edit_scraped_site_setting(scraped_site_setting_id):
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    scraped_site_setting = edit_scraped_site_settings(scraped_site_setting_id, data)
    if scraped_site_setting is None:
        return jsonify({'error': 'Cannot edit scraped site setting'}), 400
    return jsonify(scraped_site_setting), 200