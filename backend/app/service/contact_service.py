from app.model import db, Contact

def get_all_contacts():
    contacts = Contact.query.all()
    return [contact.to_dict() for contact in contacts]

def delete_contact(contact_id):
    contact = Contact.query.get(contact_id)
    if contact is None:
        return None
    db.session.delete(contact)
    db.session.commit()
    return contact.to_dict()