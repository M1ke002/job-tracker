import pyrebase
import os

from dotenv import load_dotenv

load_dotenv()

firebaseConfig = {
  "apiKey": os.getenv('FIREBASE_API_KEY'),
  "authDomain": os.getenv('FIREBASE_AUTH_DOMAIN'),
  "databaseURL": os.getenv('FIREBASE_DATABASE_URL'),
  "projectId": os.getenv('FIREBASE_PROJECT_ID'),
  "storageBucket": os.getenv('FIREBASE_STORAGE_BUCKET'),
  "messagingSenderId": os.getenv('FIREBASE_MESSAGING_SENDER_ID'),
  "appId": os.getenv('FIREBASE_APP_ID'),
  "measurementId": os.getenv('FIREBASE_MEASUREMENT_ID')
}

firebase = pyrebase.initialize_app(firebaseConfig)
storage = firebase.storage()

#sample input: file = request.files['file']. <FileStorage: 'Hoang_Nam_Trinh_CV.pdf' ('application/pdf')>
def upload_file(file, filename):
  print(filename)
  #save file to firebase with filename
  storage.child(filename).put(file)
  return True

#get url of uploaded file
def get_url(filename):
  url = storage.child(filename).get_url(None)
  print("url: ", url)
  return url
  
def delete_file(filename):
  storage.delete(filename, None)
  return True
