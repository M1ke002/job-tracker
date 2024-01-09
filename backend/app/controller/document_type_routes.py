from flask import Blueprint, jsonify, request

from app.service.document_type_service import get_all_document_types
from app.service.document_type_service import delete_document_type
from app.service.document_type_service import create_document_type

document_type_routes = Blueprint('document_type_routes', __name__)

# get all document types
@document_type_routes.route('', methods=['GET'])
def handle_get_all_document_types():
    document_types = get_all_document_types()
    return jsonify(document_types), 200

# create a document type
@document_type_routes.route('', methods=['POST'])
def handle_create_document_type():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    document_type = create_document_type(data)
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
    document_type = delete_document_type(document_type_id)
    if document_type is None:
        return jsonify({}), 404
    return jsonify(document_type), 200