from flask import Blueprint

test_routes = Blueprint('test_routes', __name__)

#home route
@test_routes.route('', methods=['GET'])
#view function
def hello_world():
    return 'Hello, World!'