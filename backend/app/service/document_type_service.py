from app.model import db, DocumentType, Document


def get_all_document_types():
    document_types = DocumentType.query.all()
    return [document_type.to_dict() for document_type in document_types]


def create_multiple_document_types(document_types):
    for document_type in document_types:
        type_name = document_type.get("typeName")
        document_type = DocumentType(type_name=type_name)
        db.session.add(document_type)
    db.session.commit()
    return "Created document types successfully"


def create_document_type(type_name):
    document_type = DocumentType(
        type_name=type_name,
    )
    db.session.add(document_type)
    db.session.commit()
    return document_type.to_dict()


def is_document_type_in_use(document_type_id):
    # check if any documents are using this document type
    documents = Document.query.filter_by(document_type_id=document_type_id).all()
    return len(documents) > 0


def delete_document_type(document_type_id):
    document_type = DocumentType.query.get(document_type_id)
    if document_type is None:
        return None

    # check if any documents are using this document type
    if is_document_type_in_use(document_type_id):
        print(
            "Cannot delete document type with id "
            + str(document_type_id)
            + " as it is being used by documents"
        )
        return None

    db.session.delete(document_type)
    db.session.commit()
    return "Deleted document type successfully"
