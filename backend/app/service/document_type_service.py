from app.model import db, DocumentType, Document

def get_all_document_types():
    document_types = DocumentType.query.all()
    return [document_type.to_dict() for document_type in document_types]

def create_document_type(data):
    type_name = data.get('typeName')

    if not type_name:
        return None
    
    document_type = DocumentType(
        type_name=type_name,
    )

    db.session.add(document_type)
    db.session.commit()

    return document_type.to_dict()

def delete_document_type(document_type_id):
    document_type = DocumentType.query.get(document_type_id)
    if document_type is None:
        return None
    
    # check if any documents are using this document type
    documents = Document.query.filter_by(document_type_id=document_type_id).all()
    if len(documents) > 0:
        print('Cannot delete document type with id ' + str(document_type_id) + ' as it is being used by documents with ids: ' + str([document.id for document in documents]))
        return None
    db.session.delete(document_type)
    db.session.commit()
    return document_type.to_dict()
