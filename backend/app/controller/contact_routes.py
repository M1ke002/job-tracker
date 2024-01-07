from flask import Blueprint

contact_routes = Blueprint('contact_routes', __name__)

# get all contacts
@contact_routes.route('', methods=['GET'])
def get_all_contacts():
    return 'get all contacts'

# create a contact
@contact_routes.route('', methods=['POST'])
def create_contact():
    return 'create a contact'

# edit a contact
@contact_routes.route('/<int:contact_id>', methods=['PUT'])
def edit_contact(contact_id):
    return 'edit a contact'

# delete a contact
@contact_routes.route('/<int:contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    return 'delete a contact'
