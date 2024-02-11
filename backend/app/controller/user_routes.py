from flask import Blueprint

user_routes = Blueprint("user_routes", __name__)


# get a user
@user_routes.route("/<int:user_id>", methods=["GET"])
def get_user(user_id):
    return "get a user"


# edit a user
@user_routes.route("/<int:user_id>", methods=["PUT"])
def edit_user(user_id):
    return "edit a user"


# delete a user
@user_routes.route("/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    return "delete a user"
