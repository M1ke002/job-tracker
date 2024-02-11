from app.model import db, Contact


def get_all_contacts():
    contacts = Contact.query.all()
    return [contact.to_dict() for contact in contacts]


def create_contact(data):
    job_id = data.get("jobId")
    person_name = data.get("personName")
    person_position = data.get("personPosition")
    person_linkedin = data.get("personLinkedin")
    person_email = data.get("personEmail")
    note = data.get("note")

    contact = Contact(
        job_id=job_id,
        person_name=person_name,
        person_position=person_position,
        person_linkedin=person_linkedin,
        person_email=person_email,
        note=note,
    )

    db.session.add(contact)
    db.session.commit()

    return contact.to_dict()


def edit_contact(job_id, data):
    person_name = data.get("personName")
    person_position = data.get("personPosition")
    person_linkedin = data.get("personLinkedin")
    person_email = data.get("personEmail")
    note = data.get("note")

    contact = Contact.query.get(job_id)
    if contact is None:
        return None

    contact.person_name = person_name
    contact.person_position = person_position
    contact.person_linkedin = person_linkedin
    contact.person_email = person_email
    contact.note = note

    db.session.commit()
    return contact.to_dict()


def delete_contact(contact_id):
    contact = Contact.query.get(contact_id)
    if contact is None:
        return None
    db.session.delete(contact)
    db.session.commit()
    return "deleted contact successfully"
