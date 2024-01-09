from app.model import db, Document

def get_all_documents():
    documents = Document.query.all()
    return [document.to_dict() for document in documents]

def create_document(data):
    document_type_id = data.get('documentTypeId')
    document_name = data.get('documentName')
    job_id = data.get('jobId')

    if not document_type_id or not document_name:
        return None
    
    document = Document(
        document_type_id=document_type_id,
        document_name=document_name,
        job_id=job_id
    )

    db.session.add(document)
    db.session.commit()

    return document.to_dict()

def delete_document(document_id):
    document = Document.query.get(document_id)
    if document is None:
        return None
    db.session.delete(document)
    db.session.commit()
    return document.to_dict()