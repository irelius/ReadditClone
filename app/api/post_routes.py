from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Post, Comment, Subreddit, User, PostLike, UserSubreddit
from app.forms import PostForm, LikeForm, CommentForm
from app.aws import (
    upload_file_to_s3, allowed_file, get_unique_filename)
from app.helper import return_post, return_posts, return_post_like, return_post_likes, return_comment, return_comments, validation_error_message
from sqlalchemy.orm import joinedload

post_routes = Blueprint("posts", __name__)

# ----------------------------------------------- Post stuff -----------------------------------------------
# Get all posts
@post_routes.route("/")
def posts_all():
    posts = Post.query.options(joinedload(Post.users), joinedload(Post.subreddits), joinedload(Post.images), joinedload(Post.post_likes)).all()
    return return_posts(posts)

# Get specific post
@post_routes.route("/<int:post_id>")
def posts_specific(post_id):
    posts = Post.query.options(joinedload(Post.users), joinedload(Post.subreddits), joinedload(Post.images)).get(post_id)
    
    return return_post(posts)

# Create a post
@post_routes.route("/", methods=["POST"])
@login_required
def posts_create_new():
    user_id = int(current_user.get_id())

    form = PostForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_post = Post(
            user_id = user_id,
            subreddit_id = form.data["subreddit_id"],
            title = form.data["title"].strip(" "),
            body = form.data["body"].strip(" "),
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

        return return_post(new_post)
    
    return {"errors": validation_error_message(form.errors)}, 400

# Update a post by id
@post_routes.route("/<int:post_id>", methods=["PUT"])
@login_required
def posts_update_specific(post_id):
    user_id = int(current_user.get_id())
    
    post_to_edit = Post.query.options(joinedload(Post.users), joinedload(Post.subreddits), joinedload(Post.images)).get(post_id)
    
    if post_to_edit.user_id != user_id:
        return {"errors": ["You do not have permission to edit this post"]}, 403

    form = PostForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():   
        post_to_edit.body = form.data["body"].strip(" ")

        db.session.commit()
        return return_post(post_to_edit)
    
    return {"errors": validation_error_message(form.errors)}, 401


# Delete a specific post
@post_routes.route("/<int:post_id>", methods=["DELETE"])
@login_required
def posts_delete_specific(post_id):
    
    user_id = int(current_user.get_id())
        
    post_to_delete = Post.query.options(joinedload(Post.users), joinedload(Post.subreddits), joinedload(Post.images)).get(post_id)

    if post_to_delete == None:
        return {"errors": ["Post does not exist"]}, 404
    
    admin_check = UserSubreddit.query.filter(UserSubreddit.user_id == user_id, UserSubreddit.subreddit_id == post_to_delete.subreddit_id, UserSubreddit.admin_status == True).first()
        
    if admin_check == None:
        return {"errors": ["You do not have permission to delete this post"]}, 403

    db.session.delete(post_to_delete)
    db.session.commit()

    return {
        "id": post_to_delete.id,
        "message": "Post successfully deleted"
    }


# ---------------------------------------------- Comment stuff ----------------------------------------------
# Get all comments made to a post
@post_routes.route("/<int:post_id>/comments")
def posts_comments(post_id):
    post_check = Post.query.get(post_id)
    if post_check == None:
        return {"errors": ["Post does not exist"]}, 404
    
    comments = Comment.query.options(joinedload(Comment.replies), joinedload(Comment.comment_likes)).filter(Comment.post_id == post_id).all()
    return return_comments(comments)


# Create a new comment on a post
@post_routes.route("/<int:post_id>/comments", methods=["POST"])
@login_required
def create_comment_on_post(post_id):
    user_id = int(current_user.get_id())

    post_check = Post.query.get(post_id)
    if post_check == None:
        return {"errors": ["Post does not exist"]}, 404

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

        return return_comment(new_comment)

    return {"errors": validation_error_message(form.errors)}, 401


# ----------------------------------------------- Post Likes -----------------------------------------------
# get likes/dislikes on a post
@post_routes.route("/<int:post_id>/likes")
def get_post_likes(post_id):
    post_check = Post.query.get(post_id)
    if post_check == None:
        return {"errors": ["Post does not exist."]}, 404 
        
    post_likes = PostLike.query.filter(PostLike.post_id == post_id).all()
    return return_post_likes(post_likes)

# Create a like/dislike to a post
@post_routes.route("/<int:post_id>/likes", methods=["POST"])
@login_required
def create_like_on_post(post_id):
    user_id = int(current_user.get_id())

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

        return return_post_like(new_like)
    
    return {"errors": validation_error_message(form.errors)}, 401


# Update existing like to a post
# TODO: Not sure how I'd get the id of the like, but if I figure it out, it would make the request faster
# could probably use a combination of the post id and the user id?
@post_routes.route("/likes/<int:like_id>", methods=["PUT"])
@login_required
def update_like_on_post(like_id):
    user_id = int(current_user.get_id())
    
    like_to_update = PostLike.query.get(like_id)
    if like_to_update == None:
        return {"errors": ["Like/dislike does not exist"]}, 404
        
    if like_to_update.user_id != user_id:
        return {"errors": ["You do not have permission to edit this like/dislike"]}, 403
    
    form = LikeForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if form.validate_on_submit():
        like_to_update.like_status = form.data["like_status"]
        db.session.commit()
        return return_post_like(like_to_update)
    
    return {"errors": validation_error_message(form.errors)}, 401
    

# Delete likes/dislikes to posts
@post_routes.route("/<int:post_id>/likes", methods=["DELETE"])
@login_required
def delete_like_on_post(post_id):
    user_id = int(current_user.get_id())
    
    like_to_delete = PostLike.query.filter(PostLike.post_id == post_id, PostLike.user_id == user_id).first()

    if like_to_delete == None:
        return {"errors": ["There is no like/dislike to remove"]}, 404
    
    if like_to_delete.user_id != user_id:
        return {"errors": ["You do not have permission to delete this like/dislike"]}, 403
     
    db.session.delete(like_to_delete)
    db.session.commit()
    
    return {
        "id": like_to_delete["id"],
        "message": "Like/dislike successfully deleted"
    }