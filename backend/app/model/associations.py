from sqlalchemy import Column, Integer, Table, ForeignKey
from .db import db

# Association table for the many-to-many relationship between SavedJob and Document
job_document_association = Table(
    "saved_job_document",
    db.Model.metadata,
    Column("saved_job_id", Integer, ForeignKey("saved_jobs.id"), primary_key=True),
    Column("document_id", Integer, ForeignKey("documents.id"), primary_key=True),
)

# Association table for the many-to-many relationship between SavedJob and Contact
# job_contact_association = Table(
#     'saved_job_contact',
#     db.Model.metadata,
#     Column('saved_job_id', Integer, ForeignKey('saved_jobs.id'), primary_key=True),
#     Column('contact_id', Integer, ForeignKey('contacts.id'), primary_key=True),
# )
