from flask import Blueprint

auth_routes = Blueprint('auth_routes', __name__)

# register a user
@auth_routes.route('/register', methods=['POST'])
def register_user():
    return 'register a user'

# login a user
@auth_routes.route('/login', methods=['POST'])
def login_user():
    return 'login a user'

# logout a user
@auth_routes.route('/logout', methods=['DELETE'])
def logout_user():
    return 'logout a user'