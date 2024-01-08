from app.model import db, Document

def get_all_documents():
    documents = Document.query.all()
    return [document.to_dict() for document in documents]

def delete_document(document_id):
    document = Document.query.get(document_id)
    if document is None:
        return None
    db.session.delete(document)
    db.session.commit()
    return document.to_dict()