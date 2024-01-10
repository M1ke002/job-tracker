import json

def write_to_file(data, file_name):
    with open(file_name, 'w') as outfile:
        json.dump(data, outfile, indent=4, sort_keys=True)