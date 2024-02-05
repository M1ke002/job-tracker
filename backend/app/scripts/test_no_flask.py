import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.model import *
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

if __name__ == '__main__':
    #try to connect to the database using flask-sqlalchemy without flask
    engine = create_engine(SQLALCHEMY_DATABASE_URI)
    Session = sessionmaker(bind=engine)
    session = Session()
    print("Connected to the database")

    #try to query the database
    all_tasks = session.query(Task).all()
    for task in all_tasks:
        print(task.task_name)
