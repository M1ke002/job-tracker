from app.model import db, Document

from app.utils.firebase import upload_file, get_url, delete_file

def get_all_documents():
    documents = Document.query.all()
    return [document.to_dict() for document in documents]


def is_document_exists_by_name(file_name):
    document = Document.query.filter_by(file_name=file_name).first()
    return document is not None


def create_and_upload_document(data, file):
    document_type_id = data.get('documentTypeId')
    job_id = data.get('jobId')
    file_name = file.filename

    print(document_type_id, job_id, file)
    
    #upload file to firebase
    is_uploaded = upload_file(file, file_name)
    if not is_uploaded:
        return None

    #get url of uploaded file
    url = get_url(file_name)

    #save document to database
    document = Document(
        document_type_id=document_type_id,
        job_id=job_id if job_id != "" else None,
        file_name=file_name,
        file_url=url
    )

    db.session.add(document)
    db.session.commit()
    
    return document.to_dict()


def edit_document(document_id, data):
    document_type_id = data.get('documentTypeId')
    job_id = data.get('jobId')
    
    job_id = job_id if job_id != "" else None
    
    document = Document.query.get(document_id)
    if document is None:
        return None
    
    document.document_type_id = document_type_id
    document.job_id = job_id

    db.session.commit()
    return document.to_dict()


def unlink_job_from_document(document_id):
    document = Document.query.get(document_id)
    if document is None:
        return None
    
    document.job_id = None
    db.session.commit()
    return document.to_dict()


def delete_document(document_id):
    document = Document.query.get(document_id)
    if document is None:
        return None
    
    #delete file from firebase
    file_name = document.file_name
    is_deleted = delete_file(file_name)
    if not is_deleted:
        return None

    db.session.delete(document)
    db.session.commit()
    return "Deleted document successfully"