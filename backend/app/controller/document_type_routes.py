from flask import Blueprint, jsonify, request

from app.service.document_type_service import get_all_document_types
from app.service.document_type_service import delete_document_type
from app.service.document_type_service import delete_document_type
from app.service.document_type_service import create_document_type
from app.service.document_type_service import create_multiple_document_types

document_type_routes = Blueprint('document_type_routes', __name__)

# get all document types
@document_type_routes.route('', methods=['GET'])
def handle_get_all_document_types():
    document_types = get_all_document_types()

    #first time running the app, create 2 default document types: resume and cover letter
    if (len(document_types) == 0):
        document_type_1 = {
            'typeName': 'Resume'
        }
        document_type_2 = {
            'typeName': 'Cover Letter'
        }
        message = create_multiple_document_types([document_type_1, document_type_2])

        if message is None:
            return jsonify({'error': 'Cannot create default document types'}), 400
        document_types = get_all_document_types()

    return jsonify(document_types), 200

# create a document type
@document_type_routes.route('', methods=['POST'])
def handle_create_document_type():
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    type_name = data.get('typeName')
    if not type_name:
        return jsonify({'error': 'No type name provided'}), 400
    
    document_type = create_document_type(type_name)
    
    if document_type is None:
        return jsonify({'error': 'Cannot create document type'}), 400
    return jsonify(document_type), 200

# edit a document type
@document_type_routes.route('/<int:document_type_id>', methods=['PUT'])
def handle_edit_document_type(document_type_id):
    return 'edit a document type'

# delete a document type
@document_type_routes.route('/<int:document_type_id>', methods=['DELETE'])
def handle_delete_document_type(document_type_id):
    message = delete_document_type(document_type_id)
    if message is None:
        return jsonify({'error': 'Cannot delete document type'}), 400
    return jsonify(message), 200