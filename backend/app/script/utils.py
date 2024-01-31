import json
import pymysql

database_config = {
    "username": 'root',
    "password": 'root',
    "host": 'localhost',
    "port": '3306',
    "database": 'job_tracker'
}

def write_to_file(data, file_name):
    with open(file_name, 'w') as outfile:
        json.dump(data, outfile, indent=4, sort_keys=True)

def connectDB():
    connection = pymysql.connect(host=database_config['host'], user=database_config['username'], password=database_config['password'], db=database_config['database'])
    return connection 