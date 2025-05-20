from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Post, Comment, Subreddit, User, PostLike, UserSubreddit
from app.forms import PostForm, LikeForm, PostCommentForm, UpdatePostForm
from app.aws import (
    upload_file_to_s3, allowed_file, get_unique_filename)
from app.helper import return_posts, return_post_likes, return_comments, validation_error_message
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
    
    return return_posts([posts])

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

        return return_posts([new_post])
    
    return {"errors": validation_error_message(form.errors)}, 400

# Update a post by id
@post_routes.route("/<int:post_id>", methods=["PUT"])
@login_required
def posts_update_specific(post_id):
    user_id = int(current_user.get_id())
    
    post_to_edit = Post.query.options(joinedload(Post.users), joinedload(Post.subreddits), joinedload(Post.images)).get(post_id)
    
    if post_to_edit.user_id != user_id:
        return {"errors": ["You do not have permission to edit this post"]}, 403

    form = UpdatePostForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        post_to_edit.body = form.data["body"].strip(" ")

        db.session.commit()
        return return_posts([post_to_edit])
    
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
        return {"errors": ["Post does not exist to get the comments of"]}, 404
    
    comments = Comment.query.options(joinedload(Comment.replies), joinedload(Comment.comment_likes)).filter(Comment.post_id == post_id).all()
    return return_comments(comments)


# Create a new comment on a post
@post_routes.route("/<int:post_id>/comments", methods=["POST"])
@login_required
def create_comment_on_post(post_id):
    user_id = int(current_user.get_id())

    post_check = Post.query.options(joinedload(Post.users), joinedload(Post.subreddits), joinedload(Post.images)).get(post_id)
    if post_check == None:
        return {"errors": ["Post does not exist to comment"]}, 404

    form = PostCommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_comment = Comment(
            body = form.data["body"],
            is_reply=False,
            deleted = False,
            
            replies_id = None,
            user_id = user_id,
            post_id = post_id,
            
            subreddit_id = post_check.subreddit_id
        )

        db.session.add(new_comment)
        db.session.commit()

        return return_comments(new_comment)

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

# handle when user likes/dislikes a post. Technically handles POST, PUT, and DELETE
@post_routes.route("/<int:post_id>/likes", methods=["POST"])
@login_required
def handle_like_on_post(post_id):
    user_id = int(current_user.get_id())
    
    # check if user has a like/dislike on the post already
    existing_like = PostLike.query.filter(PostLike.post_id == post_id, PostLike.user_id == user_id).first()    
    
    # get form data sent by user
    form = LikeForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    request_like_value = form.data["like_status"]
    
    if form.validate_on_submit():
        # POST: if like/dislike on post doesn't exist, create the like or dislike as a new row
        if existing_like == None:
            new_like = PostLike(
                like_status = request_like_value,
                post_id = post_id,
                user_id = user_id
            )
            db.session.add(new_like)
            db.session.commit()
            
            return return_post_likes([new_like])

        # if like/dislike already exists for post, manipulate the currently existing row in the database
        #   DELETE: if liking a liked post (or disliking a disliked post), delete existing row
        #   PUT: if liking a disliked post (or vice versa), update existing row
        else:
            curr_like_status = existing_like.like_status
            deleting_like = True if request_like_value == curr_like_status else False
    
            # DELETE: liking a liked post or disliking a disliked post, delete the existing row to undo the like/dislike
            if deleting_like == True:
                if existing_like.user_id != user_id:
                    return {"errors": ["You do not have permission to delete this like/dislike"]}, 403
                
                db.session.delete(existing_like)
                db.session.commit()
                return {
                    "id": existing_like.id,
                    "message": "Like/dislike on post successfully deleted",
                    "like_status": None
                }
                
            # PUT: liking a disliked post or disliking a liked post, edit the existing row to change like value
            else:
                if existing_like.user_id != user_id:
                    return {"errors": ["You do not have permission to edit this like/dislike"]}, 403
                
                existing_like.like_status = request_like_value                
                db.session.commit()
                
                return return_post_likes([existing_like])
            
    return {"errors": validation_error_message(form.errors)}, 401