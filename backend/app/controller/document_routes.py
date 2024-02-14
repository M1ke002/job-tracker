from flask import Blueprint, jsonify, request

from app.service.document_service import get_all_documents
from app.service.document_service import delete_document
from app.service.document_service import create_and_upload_document
from app.service.document_service import edit_document
from app.service.document_service import unlink_job_from_document
from app.service.document_service import is_document_exists_by_name

document_routes = Blueprint("document_routes", __name__)


# get all documents
@document_routes.route("", methods=["GET"])
def handle_get_all_documents():
    documents = get_all_documents()
    return jsonify(documents), 200


# edit a document
@document_routes.route("/<int:document_id>", methods=["PUT"])
def handle_edit_document(document_id):
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    document_type_id = data.get("documentTypeId")
    if not document_type_id or document_type_id == "":
        return jsonify({"error": "documentTypeId is required"}), 400

    document = edit_document(document_id, data)
    if document is None:
        return jsonify({}), 404
    return jsonify(document), 200


# remove linked job from a document
@document_routes.route("/<int:document_id>/unlink-job", methods=["PUT"])
def handle_unlink_job_from_document(document_id):
    document = unlink_job_from_document(document_id)
    if document is None:
        return jsonify({"error": "Document not found"}), 404
    return jsonify(document), 200


# create a document
@document_routes.route("", methods=["POST"])
def handle_create_document():
    # data sent in formData
    data = request.form
    file = request.files["file"]

    if not file:
        return jsonify({"error": "No file provided"}), 400
    if not data:
        return jsonify({"error": "No data provided"}), 400

    document_type_id = data.get("documentTypeId")
    if not document_type_id or document_type_id == "":
        return jsonify({"error": "documentTypeId is required"}), 400

    # check if there is already a document with the same name
    if is_document_exists_by_name(file.filename):
        return jsonify({"error": "Document name already exists"}), 400

    document = create_and_upload_document(data, file)
    if document is None:
        return jsonify({"error": "Cannot create document"}), 400
    return jsonify(document), 200


# delete a document
@document_routes.route("/<int:document_id>", methods=["DELETE"])
def handle_delete_document(document_id):
    message = delete_document(document_id)
    if message is None:
        return jsonify({"error": "Cannot delete document"}), 400
    return jsonify(message), 200


# search documents by name
@document_routes.route("/search", methods=["GET"])
def handle_search_documents_by_name():
    return "search documents by name"
