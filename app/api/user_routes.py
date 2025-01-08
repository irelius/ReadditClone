from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required, login_user, logout_user
from app.forms import LoginForm, SignUpForm
from app.models import db, User, UserSubreddit, Subreddit
from app.helper import validation_error_message

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


# Get current user
@user_routes.route('/current', methods=["GET"])
@login_required
def users_current():
    user = User.query.get(current_user.get_id())
    return {"users": {user.id: user.to_dict()}}


# Get specific user by id
@user_routes.route('/<int:user_id>', methods=["GET"])
def users_specific(user_id):
    user = User.query.get(user_id)
    return {"users": {user_id: user.to_dict()}}


# Get all subreddits specific user is part of
@user_routes.route("/<int:user_id>/subreddits")
def users_subreddits(user_id):
    user = User.query.get(user_id)
    
    data = user.to_dict()
    user_subreddit = Subreddit.query.join(UserSubreddit).filter(UserSubreddit.user_id == user_id).all()
    data['subreddit'] = {user.id: user.to_dict() for user in user_subreddit}
    
    return data


# Unauthorized user access
@user_routes.route("/unauthorized", methods=["GET"])
def users_unauthorized():
    return {"errors": ["Unauthorized access"]}, 401

