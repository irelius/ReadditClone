from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import db, User, UserSubreddit, Post, Comment, CommentLike, PostLike
from app.helper import validation_error_message, return_comments, return_posts, return_users, return_post_likes, return_comment_likes

user_routes = Blueprint('users', __name__)

# --------------------------------------------- User stuff ---------------------------------------------
# Get all users
@user_routes.route('/')
@login_required
def users():
    users = User.query.all()
    return return_users(users)

# Get current user
@user_routes.route('/current')
@login_required
def users_current():
    user_id = int(current_user.get_id())
    user = User.query.get(user_id)
    return {"users": {user.id: user.to_dict()}}


# Get specific user by id
@user_routes.route('/<int:user_id>')
def users_specific(user_id):
    user = User.query.get(user_id)
    return {"users": {user_id: user.to_dict()}}


# delete current user's account
@user_routes.route("/current", methods=["DELETE"])
@login_required
def users_delete():
    user = User.query.get(current_user.get_id())
    if user == None:
        return {'errors': ["This user does not exist"]}, 404

    db.session.delete(user)
    db.session.commit()
    return {"message": f"Successfully deleted User {current_user.id}'s account"} 


# # Unauthorized user access
# @user_routes.route("/unauthorized", methods=["GET"])
# def users_unauthorized():
#     return {"errors": ["Unauthorized access"]}, 403


# ------------------------------------------ Subreddit stuff ------------------------------------------
# Get all subreddits specific user is part of
@user_routes.route("/<int:user_id>/subreddits")
def user_subreddits(user_id):
    user_subs = UserSubreddit.query.filter(UserSubreddit.user_id == user_id).join(User).all()
    
    if len(user_subs) == 0:
        return {"errors": ["Subreddits do not exist"]}, 404
    
    subreddit_by_id = []
    all_subreddits = {}

    for subreddit in user_subs:
        subreddit_by_id.append(subreddit.id)
        all_subreddits[subreddit.id] = subreddit.subreddit_data_dict()
    
    return {
        "subreddit_by_id": subreddit_by_id,
        "all_subreddits": all_subreddits
    }


# -------------------------------------------- Post stuff --------------------------------------------
# Get posts of a specific user
@user_routes.route("/<int:user_id>/posts")
def user_posts(user_id):
    posts = Post.query.filter(Post.user_id == user_id).all()
    return return_posts(posts)

# Get posts of current user
@user_routes.route("/current/posts")
@login_required
def current_user_posts():
    user_id = int(current_user.get_id())
    posts = Post.query.filter(Post.user_id == user_id).all()
    return return_posts(posts)


# ----------------------------------------- Post Likes stuff -----------------------------------------
# Get all likes made to posts by specific user
@user_routes.route("/<int:user_id>/post_likes")
def user_post_likes(user_id):
    post_likes = PostLike.query.filter(PostLike.user_id == user_id).all()
    return return_post_likes(post_likes)

# Get like status of a post by current user
@user_routes.route("/current/posts/<int:post_id>/likes")
@login_required
def current_user_post_likes(post_id):
    user_id = int(current_user.get_id())
    
    post_check = Post.query.get(post_id)
    if post_check == None:
        return {"errors": ["Post does not exist."]}, 404
    
    if user_id == None:
        return {"errors": ["You must be logged in before viewing your likes on posts."]}, 401
    
    
    post_likes = PostLike.query.filter(PostLike.post_id == post_id, PostLike.user_id == user_id).all()
    return return_post_likes(post_likes)


# ------------------------------------------ Comment stuff ------------------------------------------
# Get comments of a user
@user_routes.route("/<int:user_id>/comments")
def users_comments(user_id):
    comments = Comment.query.filter(Comment.user_id == user_id).all()
    return return_comments(comments)

# Get comments of current user
@user_routes.route("/current/comments")
@login_required
def current_user_comments():
    user_id = int(current_user.get_id())
    comments = Comment.query.filter(Comment.user_id == user_id).all()
    return return_comments(comments)


# --------------------------------------- Comment Likes stuff ---------------------------------------
# Get all likes made to a comment by specific user
@user_routes.route("/<int:user_id>/comment_likes")
def user_comment_likes(user_id):
    comment_likes = CommentLike.query.filter(CommentLike.user_id == user_id).all()
    return return_comment_likes(comment_likes)

# Get like status of a comment by current user
@user_routes.route("/current/comments/<int:comment_id>/likes")
@login_required
def current_user_comment_likes(comment_id):
    user_id = int(current_user.get_id())
    
    comment_check = Comment.query.get(comment_id)
    if comment_check == None:
        return {"errors": ["Comment does not exist."]}, 404
    
    if user_id == None:
        return {"errors": ["You must be logged in before viewing your likes on comments."]}, 401
    
    
    comment_likes = CommentLike.query.filter(CommentLike.comment_id == comment_id, CommentLike.user_id == user_id).all()
    return return_comment_likes(comment_likes)
