import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

database_config = {
    "username": os.getenv('DB_USERNAME'),
    "password": os.getenv('DB_PASSWORD'),
    "host": 'localhost',
    "port": '3306',
    "database": 'job_tracker'
}

SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{database_config['username']}:{database_config['password']}@{database_config['host']}:{database_config['port']}/{database_config['database']}"

def write_to_file(data, file_name):
    with open(file_name, 'w') as outfile:
        json.dump(data, outfile, indent=4, sort_keys=True)

def create_sqlalchemy_session():
    engine = create_engine(SQLALCHEMY_DATABASE_URI)
    Session = sessionmaker(bind=engine)
    session = Session()
    return session