from flask import Blueprint
from flask_login import current_user, login_required
from app.models import db, User, UserSubreddit, Post, Comment, CommentLike, PostLike
from app.helper import return_comments, return_posts, return_user, return_users, return_post_likes, return_comment_likes, return_user_subs
from sqlalchemy.orm import joinedload

user_routes = Blueprint('users', __name__)

# --------------------------------------------- User stuff ---------------------------------------------
# Get all users
@user_routes.route('/')
def users():
    users = User.query.all()
    return return_users(users)

# Get current user
@user_routes.route('/current')
@login_required
def users_current():
    user_id = int(current_user.get_id())
    user = User.query.get(user_id)
    
    # "to_dict()" used since the current user should be able to see their own information
    return {
        "users_by_id": [user.id],
        "all_users": {user.id: user.to_dict()}
    }

# Get specific user by id
@user_routes.route('/<int:user_id>')
def users_specific(user_id):
    user = User.query.get(user_id)
    return return_user(user)


# delete current user's account
@user_routes.route("/current", methods=["DELETE"])
@login_required
def users_delete():
    user = User.query.get(current_user.get_id())
    
    if user == None:
        return {"errors": ["User account does not exist"]}, 404

    db.session.delete(user.id)
    db.session.commit()
    return {
        "id": user.id,
        "message": "User account successfully deleted"
    } 


# # Unauthorized user access
# @user_routes.route("/unauthorized", methods=["GET"])
# def users_unauthorized():
#     return {"errors": ["Unauthorized access"]}, 403


# ------------------------------------------ Subreddit stuff ------------------------------------------
# Get all subreddits specific user is part of
@user_routes.route("/<int:user_id>/subreddits")
def user_subreddits(user_id):
    user_check = User.query.get(user_id)
    if user_check == None:
        return {"errors": ["User does not exist"]}, 404
    
    user_subs = UserSubreddit.query.options(joinedload(UserSubreddit.subreddit_join)).filter(UserSubreddit.user_id == user_id).join(User).all()
    
    return return_user_subs(user_subs, "subreddit")

# get all subreddits current user is part of
@user_routes.route('/current/subreddits')
@login_required
def current_user_subreddits():
    user_id = int(current_user.get_id())

    user_subs = UserSubreddit.query.options(joinedload(UserSubreddit.subreddit_join)).filter(UserSubreddit.user_id == user_id).join(User).all()
    return return_user_subs(user_subs, "subreddit")
    

# -------------------------------------------- Post stuff --------------------------------------------
# Get posts of a specific user
@user_routes.route("/<int:user_id>/posts")
def user_posts(user_id):    
    user_check = User.query.get(user_id)
    if user_check == None:
        return {"errors": ["User does not exist"]}, 404
    
    posts = Post.query.options(joinedload(Post.post_likes), joinedload(Post.comments), joinedload(Post.images), joinedload(Post.users), joinedload(Post.subreddits)).filter(Post.user_id == user_id).all()

    return return_posts(posts)


# Get posts of current user
@user_routes.route("/current/posts")
@login_required
def current_user_posts():
    user_id = int(current_user.get_id())
    posts = Post.query.options(joinedload(Post.post_likes), joinedload(Post.comments), joinedload(Post.images), joinedload(Post.users), joinedload(Post.subreddits)).filter(Post.user_id == user_id).all()
    return return_posts(posts)


# ----------------------------------------- Post Likes stuff -----------------------------------------
# Get all likes made to posts by specific user
@user_routes.route("/<int:user_id>/post_likes")
def user_post_likes(user_id):
    user_check = User.query.get(user_id)
    if user_check == None:
        return {"errors": ["User does not exist"]}, 404
    
    post_likes = PostLike.query.filter(PostLike.user_id == user_id).all()
    return return_post_likes(post_likes)

# Get like status of a post by current user
@user_routes.route("/current/posts/<int:post_id>/likes")
@login_required
def current_user_post_likes(post_id):
    user_id = int(current_user.get_id())
    
    post_check = Post.query.options(joinedload(Post.post_likes), joinedload(Post.comments), joinedload(Post.images), joinedload(Post.users), joinedload(Post.subreddits)).get(post_id)
    if post_check == None:
        return {"errors": ["Post does not exist."]}, 404
        
    post_likes = PostLike.query.filter(PostLike.post_id == post_id, PostLike.user_id == user_id).all()
    return return_post_likes(post_likes)

# ------------------------------------------ Comment stuff ------------------------------------------
# Get comments of a user
@user_routes.route("/<int:user_id>/comments")
def users_comments(user_id):
    user_check = User.query.get(user_id)
    if user_check == None:
        return {"errors": ["User does not exist"]}, 404
    
    comments = Comment.query.options(joinedload(Comment.comment_likes), joinedload(Comment.replies)).filter(Comment.user_id == user_id).all()
    return return_comments(comments)

# Get comments of current user
@user_routes.route("/current/comments")
@login_required
def current_user_comments():
    user_id = int(current_user.get_id())
    comments = Comment.query.options(joinedload(Comment.comment_likes), joinedload(Comment.replies)).filter(Comment.user_id == user_id).all()
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
    
    comment_check = Comment.query.options(joinedload(Comment.comment_likes), joinedload(Comment.replies)).get(comment_id)
    if comment_check == None:
        return {"errors": ["Comment does not exist."]}, 404

    comment_likes = CommentLike.query.filter(CommentLike.comment_id == comment_id, CommentLike.user_id == user_id).all()
    return return_comment_likes(comment_likes)
