from flask import Blueprint, jsonify, request

from app.service.document_service import get_all_documents
from app.service.document_service import delete_document
from app.service.document_service import create_document

document_routes = Blueprint('document_routes', __name__)

# get all documents
@document_routes.route('', methods=['GET'])
def handle_get_all_documents():
    documents = get_all_documents()
    return jsonify(documents), 200

# edit a document
@document_routes.route('/<int:document_id>', methods=['PUT'])
def handle_edit_document(document_id):
    return 'edit a document'

# create a document
@document_routes.route('', methods=['POST'])
def handle_create_document():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    document = create_document(data)
    if document is None:
        return jsonify({'error': 'Cannot create document'}), 400
    return jsonify(document), 200

# delete a document
@document_routes.route('/<int:document_id>', methods=['DELETE'])
def handle_delete_document(document_id):
    document = delete_document(document_id)
    if document is None:
        return jsonify({}), 404
    return jsonify(document), 200

# search documents by name
@document_routes.route('/search', methods=['GET'])
def handle_search_documents_by_name():
    return 'search documents by name'
    