from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Post, Comment, Subreddit, User, PostLike
from app.forms import PostForm, LikeForm, CommentForm
from app.aws import (
    upload_file_to_s3, allowed_file, get_unique_filename)
from app.helper import return_posts, return_comments, validation_error_message

post_routes = Blueprint("posts", __name__)


# Get all posts
@post_routes.route("/")
def posts_all():
    posts = Post.query.all()
    return return_posts(posts)


# Get specific post by id
@post_routes.route("/<int:post_id>")
def posts_specific(post_id):
    post = Post.query.get(post_id).to_dict()
    users = User.query.get(post["user_id"]).safe_to_dict()
    post['user'] = users
    
    return post


# Get all comments made to a post
@post_routes.route("/<int:post_id>/comments")
def posts_comments(post_id):
    comments = Comment.query.filter(Comment.post_id == post_id).all()
    return return_comments(comments)


# Create a post
@post_routes.route("/", methods=["POST"])
@login_required
def posts_create_new():
    user_id = int(current_user.get_id())

    if user_id == None:
        return {"errors": "You must be logged in before creating a post"}, 401

    form = PostForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_post = Post(
            user_id = user_id,
            subreddit_id = form.data["subreddit_id"],
            title = form.data["title"],
            body = form.data["body"],
            # image = form.data["image"],
            # video = form.data["video"],
        )

        db.session.add(new_post)
        db.session.commit()
        
        # Auto like the post by the creator
        post_data = new_post.to_dict()
        auto_post_like = PostLike(
            like_status = "like",
            user_id = user_id,
            post_id = post_data["id"]
        )
        db.session.add(auto_post_like)
        db.session.commit()

        return new_post.to_dict()
    return {"errors": validation_error_message(form.errors)}, 400


# Create a new comment on a post
@post_routes.route("/<int:post_id>/comments", methods=["POST"])
@login_required
def create_comment_on_post(post_id):
    user_id = int(current_user.get_id())

    if user_id == None:
        return {"errors": "You must be logged in before leaving a comment"}, 401

    form = CommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_comment = Comment(
            body = form.data["body"],
            is_reply=form.data["is_reply"],
            deleted = False,
            replies_id = None,
            user_id = user_id,
            post_id = post_id,
            subreddit_id = form.data["subreddit_id"],
        )

        db.session.add(new_comment)
        db.session.commit()

        return new_comment.to_dict()

    return {"errors": validation_error_message(form.errors)}, 401


# Create a like/dislike to a post
@post_routes.route("/<int:post_id>/likes", methods=["POST"])
@login_required
def create_like_on_post(post_id):
    user_id = int(current_user.get_id())

    if user_id == None:
        return {"errors": "You must be logged in before liking/disliking a post"}, 401

    form = LikeForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_like = PostLike(
            like_status = form.data["like_status"],
            post_id = post_id,
            user_id = user_id
        )

        db.session.add(new_like)
        db.session.commit()

        return new_like.to_dict()
    return {"errors": validation_error_message(form.errors)}, 401


# Update existing like to a post
# TODO: Not sure how I'd get the id of the like, but if I figure it out, it would make the request faster
@post_routes.route("/likes/<int:like_id>", methods=["PUT"])
@login_required
def update_like_on_post(like_id):
    user_id = int(current_user.get_id())
    
    like_to_update = PostLike.query.get(like_id)
    
    if like_to_update == None:
        return {"errors": "Like/dislike does not exist"}, 404
        
    if like_to_update.user_id != user_id:
        return {"errors": "Current user is not authorized to update this like/dislike"}, 403
    
    form = LikeForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if form.validate_on_submit():
        like_to_update.like_status = form.data["like_status"]
        db.session.commit()
        return like_to_update.to_dict()
    
    return {"errors": validation_error_message(form.errors)}, 401
    

# Delete likes/dislikes to posts
@post_routes.route("/<int:post_id>/likes", methods=["DELETE"])
@login_required
def delete_like_on_post(post_id):
    user_id = int(current_user.get_id())
    
    like_to_delete = PostLike.query.filter(PostLike.post_id == post_id, PostLike.user_id == user_id).first()
    
    if like_to_delete.user_id != user_id:
        return {"errors": "This like/dislike does not belong to current user"}, 403
    
    if like_to_delete == None:
       return {"errors": "Current user is not authorized to delete this like/dislike"}, 403
     
    db.session.delete(like_to_delete)
    db.session.commit()
    
    return {"message": "Like/dislike successfully deleted"}


# Update a post by id
@post_routes.route("/<int:post_id>", methods=["PUT"])
def posts_update_specific(post_id):
    user_id = int(current_user.get_id())
    post_to_edit = Post.query.get(post_id)

    if user_id == None:
        return {"errors": "You must be logged in before editing a post"}, 401

    if post_to_edit.user_id != user_id:
        return {"errors": "You do not have permission to edit this post"}, 403

    form = PostForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():   
        post_to_edit.title = form.data["title"]
        post_to_edit.body = form.data["body"]

        db.session.commit()
        return post_to_edit.to_dict()
    return {"errors": validation_error_message(form.errors)}, 401


# Delete a specific post
@post_routes.route("/<int:post_id>", methods=["DELETE"])
@login_required
def posts_delete_specific(post_id):
    user_id = int(current_user.get_id())
    post_to_delete = Post.query.get(post_id)
    subreddit = Subreddit.query.get(post_to_delete.subreddit_id)

    if post_to_delete == None:
        return {"errors": f"Post {post_id} does not exist"}, 404

    if post_to_delete.user_id != user_id and subreddit.admin_id != user_id:
        return {"errors": f"User {user_id} does not have permission to delete Post {id}"}, 403

    db.session.delete(post_to_delete)
    db.session.commit()

    return {"message": f"Successfully deleted Post {post_id}"}
