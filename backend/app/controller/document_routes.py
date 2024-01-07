from flask import Blueprint

document_routes = Blueprint('document_routes', __name__)

# get all documents
@document_routes.route('', methods=['GET'])
def get_all_documents():
    return 'get all documents'

# edit a document
@document_routes.route('/<int:document_id>', methods=['PUT'])
def edit_document(document_id):
    return 'edit a document'

# create a document
@document_routes.route('', methods=['POST'])
def create_document():
    return 'create a document'

# delete a document
@document_routes.route('/<int:document_id>', methods=['DELETE'])
def delete_document(document_id):
    return 'delete a document'

# search documents by name
@document_routes.route('/search', methods=['GET'])
def search_documents_by_name():
    return 'search documents by name'
    