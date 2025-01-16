from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required, login_user, logout_user
from app.forms import LoginForm, SignUpForm
from app.models import db, User, UserSubreddit, Subreddit, Post, PostLike, Comment
from app.helper import validation_error_message, return_comments, return_posts

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
    user_id = int(current_user.get_id())
    user = User.query.get(user_id)
    return {"users": {user.id: user.to_dict()}}


# Get specific user by id
@user_routes.route('/<int:user_id>', methods=["GET"])
def users_specific(user_id):
    user = User.query.get(user_id)
    return {"users": {user_id: user.to_dict()}}


# Get all subreddits specific user is part of
@user_routes.route("/<int:user_id>/subreddits")
def user_subreddits(user_id):
    user_subs = UserSubreddit.query.filter(UserSubreddit.user_id == user_id).join(User).all()
    if len(user_subs) == 0:
        return {"errors": "User is not part of any subreddits."}
    return {user_sub.id: user_sub.subreddit_data_dict() for user_sub in user_subs}


# Get posts of a user. Also use for current user
@user_routes.route("/<int:user_id>/posts")
@login_required
def user_posts(user_id):
    posts = Post.query.filter(Post.user_id == user_id).all()
    return return_posts(posts)

# Get comments of a user. Also use for current user
@user_routes.route("/<int:user_id>/comments")
def users_comments(user_id):
    comments = Comment.query.filter(Comment.user_id == user_id).all()
    return return_comments(comments)
    

# # Unauthorized user access
# @user_routes.route("/unauthorized", methods=["GET"])
# def users_unauthorized():
#     return {"errors": ["Unauthorized access"]}, 403

