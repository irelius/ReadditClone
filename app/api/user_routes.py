from flask import Blueprint
from flask_login import current_user, login_required
from app.models import db, User, UserSubreddit, Post, Comment, CommentLike, PostLike
from app.helper import return_comments, return_comments_flat, return_posts, return_users, return_comment_likes, return_user_subs
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
    user_id = int(current_user.get_id() or 0)
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
    return return_users([user])


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
    user_id = int(current_user.get_id() or 0)

    user_subs = UserSubreddit.query.options(joinedload(UserSubreddit.subreddit_join)).filter(UserSubreddit.user_id == user_id).join(User).all()
    return return_user_subs(user_subs, "subreddit")
    

# -------------------------------------------- Post stuff --------------------------------------------
# Get posts of a specific user
@user_routes.route("/<int:user_id>/posts")
def user_posts(user_id):    
    user_check = User.query.get(user_id)
    if user_check == None:
        return {"errors": ["User does not exist"]}, 404
    
    posts = Post.query.options(joinedload(Post.users), joinedload(Post.subreddits), joinedload(Post.images), joinedload(Post.post_likes), joinedload(Post.comments)).filter(Post.user_id == user_id).all()

    return return_posts(posts)


# Get posts of current user
@user_routes.route("/current/posts")
@login_required
def current_user_posts():
    user_id = int(current_user.get_id() or 0)
    posts = Post.query.options(joinedload(Post.users), joinedload(Post.subreddits), joinedload(Post.images), joinedload(Post.post_likes), joinedload(Post.comments)).filter(Post.user_id == user_id).all()
    return return_posts(posts)


# ----------------------------------------- Post Likes stuff -----------------------------------------
# Get a specific post liked/dislike status by current user
@user_routes.route("/current/posts/<int:post_id>/likes")
@login_required
def current_user_post_likes(post_id):
    user_id = int(current_user.get_id() or 0) 
    
    post_check = Post.query.options(joinedload(Post.post_likes), joinedload(Post.comments), joinedload(Post.images), joinedload(Post.users), joinedload(Post.subreddits)).get(post_id)
    
    if post_check == None:
        return {"errors": ["Post does not exist."]}, 404
    
    post_like = PostLike.query.options(joinedload(PostLike.posts)).filter(PostLike.post_id == post_id, PostLike.user_id == user_id).first()
        
    liked_posts_data = {
        "liked_posts_by_id": [],
        "liked_posts": {}
    }

    if post_like == None:
        return liked_posts_data

    for post_like in [post_like]:
        liked_posts_data["liked_posts_by_id"].append(post_like.post_id)
        liked_posts_data["liked_posts"][post_like.post_id] = post_like.to_dict()

    return liked_posts_data


# Get all posts liked/disliked by current user
@user_routes.route("/current/posts/all/likes")
@login_required
def current_user_posts_likes():
    user_id = int(current_user.get_id() or 0)
    
    post_likes = PostLike.query.options(joinedload(PostLike.posts)).filter(PostLike.user_id == user_id).all()
    
    liked_posts_data = {
        "liked_posts_by_id": [],
        "liked_posts": {},
    }
    
    for post_like in post_likes:
        liked_posts_data["liked_posts_by_id"].append(post_like.post_id)
        liked_posts_data["liked_posts"][post_like.post_id] = post_like.to_dict()
    
    return liked_posts_data


# Get all post likes made by specific user
@user_routes.route("/<int:user_id>/posts/all/likes")
def user_post_likes(user_id):
    user_check = User.query.get(user_id)
    if user_check == None:
        return {"errors": ["User does not exist"]}, 404
    
    post_likes = PostLike.query.options(joinedload(PostLike.posts)).filter(PostLike.user_id == user_id).all()
    
    liked_posts_data = {
        "liked_posts_by_id": [],
        "liked_posts": {},
    }
    
    for post_like in post_likes:
        liked_posts_data["liked_posts_by_id"].append(post_like.post_id)
        liked_posts_data["liked_posts"][post_like.post_id] = post_like.to_dict()
    
    return liked_posts_data




# ------------------------------------------ Comment stuff ------------------------------------------
# Get comments of a user
@user_routes.route("/<int:user_id>/comments")
def users_comments(user_id):
    user_check = User.query.get(user_id)
    if user_check == None:
        return {"errors": ["User does not exist"]}, 404
    
    comments = Comment.query.options(joinedload(Comment.comment_likes), joinedload(Comment.replies)).filter(Comment.user_id == user_id).all()
    return return_comments_flat(comments)

# Get comments of current user
@user_routes.route("/current/comments")
@login_required
def current_user_comments():
    user_id = int(current_user.get_id() or 0)
    comments = Comment.query.options(joinedload(Comment.comment_likes), joinedload(Comment.replies)).filter(Comment.user_id == user_id).all()
    return return_comments_flat(comments)


# --------------------------------------- Comment Likes stuff ---------------------------------------
# Get all likes made to comments by specific user
@user_routes.route("/<int:user_id>/comments/all/likes")
def user_comment_likes(user_id):
    comment_likes = CommentLike.query.filter(CommentLike.user_id == user_id).all()
    return return_comment_likes(comment_likes)

# Get all likes made to comments by current user
@login_required
@user_routes.route("/current/comments/all/likes")
def current_user_comments_likes():
    user_id = int(current_user.get_id() or 0)
    
    comment_likes = CommentLike.query.filter(CommentLike.user_id == user_id).all()
    
    liked_comments_data = {
        "comment_likes_by_id": [],
        "all_comment_likes": {},
    }
    
    for comment_like in comment_likes:
        liked_comments_data["comment_likes_by_id"].append(comment_like.comment_id)
        liked_comments_data["all_comment_likes"][comment_like.comment_id] = comment_like.to_dict()
    
    return liked_comments_data

# Get all comment likes of a specific post by current user
@login_required
@user_routes.route("/current/posts/<int:post_id>/comments/likes")
def current_user_post_comments_likes(post_id):
    user_id = int(current_user.get_id() or 0)
    
    comment_likes = CommentLike.query.filter(CommentLike.user_id == user_id, CommentLike.post_id == post_id).all()
    
    liked_comments_data = {
        "comment_likes_by_id": [],
        "all_comment_likes": {},
    }
    
    for comment_like in comment_likes:
        liked_comments_data["comment_likes_by_id"].append(comment_like.comment_id)
        liked_comments_data["all_comment_likes"][comment_like.comment_id] = comment_like.to_dict()
    
    return liked_comments_data


# Get like status of a comment by current user
@user_routes.route("/current/comments/<int:comment_id>/likes")
@login_required
def current_user_comment_likes(comment_id):
    user_id = int(current_user.get_id() or 0)
    
    comment_check = Comment.query.options(joinedload(Comment.comment_likes), joinedload(Comment.replies)).get(comment_id)
    if comment_check == None:
        return {"errors": ["Comment does not exist."]}, 404

    comment_likes = CommentLike.query.filter(CommentLike.comment_id == comment_id, CommentLike.user_id == user_id).all()
    return return_comment_likes(comment_likes)