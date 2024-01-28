from app.model import db, Document

from app.utils.firebase import upload_file, get_url, delete_file

def get_all_documents():
    documents = Document.query.all()
    return [document.to_dict() for document in documents]

def create_document(data, file):
    document_type_id = data.get('documentTypeId')
    job_id = data.get('jobId')

    print(document_type_id, job_id, file)

    if not document_type_id or document_type_id == "" or not file:
        return None
    
    file_name = file.filename

    #check if there is already a document with the same name
    document = Document.query.filter_by(file_name=file_name).first()
    if document:
        print("document name already exists")
        return None
    
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

    if not document_type_id or document_type_id == "":
        return None
    job_id = job_id if job_id != "" else None
    
    document = Document.query.get(document_id)
    if document is None:
        return None
    
    document.document_type_id = document_type_id
    document.job_id = job_id

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