from flask import Blueprint, request, jsonify

from app.service.contact_service import get_all_contacts
from app.service.contact_service import delete_contact

contact_routes = Blueprint('contact_routes', __name__)

# get all contacts
@contact_routes.route('', methods=['GET'])
def handle_get_all_contacts():
    contacts = get_all_contacts()
    return jsonify(contacts), 200

# create a contact
@contact_routes.route('', methods=['POST'])
def handle_create_contact():
    return 'create a contact'

# edit a contact
@contact_routes.route('/<int:contact_id>', methods=['PUT'])
def handle_edit_contact(contact_id):
    return 'edit a contact'

# delete a contact
@contact_routes.route('/<int:contact_id>', methods=['DELETE'])
def handle_delete_contact(contact_id):
    contact = delete_contact(contact_id)
    if contact is None:
        return jsonify({}), 404
    return jsonify(contact), 200
