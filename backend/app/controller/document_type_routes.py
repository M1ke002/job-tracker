from flask import Blueprint

document_type_routes = Blueprint('document_type_routes', __name__)

# get all document types
@document_type_routes.route('', methods=['GET'])
def get_all_document_types():
    return 'get all document types'

# create a document type
@document_type_routes.route('', methods=['POST'])
def create_document_type():
    return 'create a document type'

# edit a document type
@document_type_routes.route('/<int:document_type_id>', methods=['PUT'])
def edit_document_type(document_type_id):
    return 'edit a document type'

# delete a document type
@document_type_routes.route('/<int:document_type_id>', methods=['DELETE'])
def delete_document_type(document_type_id):
    return 'delete a document type'

