from flask import Blueprint, request, jsonify

from app.service.contact_service import get_all_contacts
from app.service.contact_service import delete_contact
from app.service.contact_service import create_contact
from app.service.contact_service import edit_contact

contact_routes = Blueprint('contact_routes', __name__)

# get all contacts
@contact_routes.route('', methods=['GET'])
def handle_get_all_contacts():
    contacts = get_all_contacts()
    return jsonify(contacts), 200

# create a contact
@contact_routes.route('', methods=['POST'])
def handle_create_contact():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    if not data.get('jobId') or not data.get('personName'):
        return jsonify({'error': 'jobId and personName are required'}), 400
    
    contact = create_contact(data)
    if contact is None:
        return jsonify({'error': 'Cant create contact'}), 400
    return jsonify(contact), 200

# edit a contact
@contact_routes.route('/<int:contact_id>', methods=['PUT'])
def handle_edit_contact(contact_id):
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    if not data.get('personName'):
        return jsonify({'error': 'personName is required'}), 400
    
    contact = edit_contact(contact_id, data)
    if contact is None:
        return jsonify({'error': 'Cant edit contact'}), 400
    return jsonify(contact), 200

# delete a contact
@contact_routes.route('/<int:contact_id>', methods=['DELETE'])
def handle_delete_contact(contact_id):
    message = delete_contact(contact_id)
    if message is None:
        return jsonify({}), 404
    return jsonify(message), 200
