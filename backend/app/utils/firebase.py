import pyrebase
import os

from dotenv import load_dotenv

load_dotenv()

firebaseConfig = {
    "apiKey": os.getenv("FIREBASE_API_KEY"),
    "authDomain": os.getenv("FIREBASE_AUTH_DOMAIN"),
    "databaseURL": os.getenv("FIREBASE_DATABASE_URL"),
    "projectId": os.getenv("FIREBASE_PROJECT_ID"),
    "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET"),
    "messagingSenderId": os.getenv("FIREBASE_MESSAGING_SENDER_ID"),
    "appId": os.getenv("FIREBASE_APP_ID"),
    "measurementId": os.getenv("FIREBASE_MEASUREMENT_ID"),
}

# singleton storage instance
_storage_instance = None


def get_firebase_storage():
    global _storage_instance
    # only initialize once
    if _storage_instance is None:
        firebase = pyrebase.initialize_app(firebaseConfig)
        _storage_instance = firebase.storage()
    return _storage_instance


# sample input: file = request.files['file']. <FileStorage: 'name.pdf' ('application/pdf')>
def upload_file(file, filename):
    print(filename)
    storage = get_firebase_storage()
    # save file to firebase with filename
    storage.child(filename).put(file)
    return True


# get url of uploaded file
def get_url(filename):
    storage = get_firebase_storage()
    url = storage.child(filename).get_url(None)
    print("url: ", url)
    return url


def delete_file(filename):
    storage = get_firebase_storage()
    storage.delete(filename, None)
    return True
