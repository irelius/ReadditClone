from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Comment, User, Subreddit, CommentLike
from app.forms import CommentForm, LikeForm
from app.helper import return_comment, return_comments, return_comment_like, return_comment_likes, validation_error_message

comment_routes = Blueprint("comments", __name__)

# ----------------------------------------------- Comment stuff -----------------------------------------------
# Get all comments
@comment_routes.route("/")
def comments_all():
    comments = Comment.query.all()
    return return_comments(comments)

# Get specific comment by id
@comment_routes.route("/<int:comment_id>")
def comments_specific(comment_id):
    comment = Comment.query.get(comment_id)
    return return_comment(comment)

# Create a new comment on a comment
@comment_routes.route("/<int:comment_id>", methods=["POST"])
@login_required
def create_comment_on_comment(comment_id):
    user_id = int(current_user.get_id())

    if user_id == None:
        return {"errors": ["You must be logged in before leaving a comment"]}, 401

    form = CommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_comment = Comment(
            body = form.data["body"],
            is_reply = form.data["is_reply"],
            deleted = False,
            replies_id = comment_id,
            user_id = user_id,
            post_id = form.data["post_id"],
            subreddit_id = form.data["subreddit_id"],
        )

        db.session.add(new_comment)
        db.session.commit()

        return return_comment(new_comment)

    return {"errors": validation_error_message(form.errors)}, 401


# Update a specific comment
@comment_routes.route("/<int:comment_id>", methods=["PUT"])
@login_required
def comments_update_specific(comment_id):
    user_id = int(current_user.get_id())
    comment_to_edit = Comment.query.get(comment_id)

    if user_id == None:
        return {"errors": ["You must be logged in before leaving a comment"]}, 401

    if comment_to_edit.user_id != user_id:
        return {"errors": ["You do not have permission to edit this comment"]}, 403

    form = CommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if form.validate_on_submit():
        comment_to_edit.body = form.data["body"].strip(" ")
        db.session.commit()
        
        return return_comment(comment_to_edit)
    
    return {"errors": validation_error_message(form.errors)}, 401


# Delete a specific comment
# While not a true delete, doing this is necessary to keep the binary tree of comment structure 
@comment_routes.route("/<int:comment_id>", methods=["DELETE"])
@login_required
def comments_delete_specific(comment_id):
    user_id = int(current_user.get_id())
    comment_to_delete = Comment.query.get(comment_id)
    subreddit = Subreddit.query.get(comment_to_delete.subreddit_id)

    if comment_to_delete == None:
        return {"errors": ["Comment does not exist to delete"]}, 404
       
    if comment_to_delete.user_id == user_id:    
        comment_to_delete.body = "Comment deleted by user."
    elif subreddit.admin_id == user_id:
        comment_to_delete.body = "Comment removed by admin."
    else:
        return {"errors": ["You are not authorized to delete this comment."]}, 403
    
    # While not a true delete, doing this is necessary to keep the binary tree of comment structure and keep to reddit's functionality
    comment_to_delete.deleted = True
    db.session.commit()

    return {
        "id": comment_to_delete.id,
        "message": "Comment successfully deleted."
    }


# ----------------------------------------------- Comment Likes -----------------------------------------------
# get likes/dislikes on a comment
@comment_routes.route('/<int:comment_id>/likes')
def get_comment_likes(comment_id):
    comment_check = Comment.query.get(comment_id)
    if comment_check == None:
        return {"errors": ["Comment does not exist."]}, 404
    
    comment_likes = CommentLike.query.filter(CommentLike.comment_id == comment_id).all()
    return return_comment_likes(comment_likes)


# Create a like/dislike to a comment
# TODO: add in a check to see if a like/dislike already exists
@comment_routes.route("/<int:comment_id>/likes", methods=["POST"])
@login_required
def create_like_on_comment(comment_id):
    user_id = int(current_user.get_id())
        
    form = LikeForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if form.validate_on_submit():
        new_like = CommentLike(
            like_status = form.data["like_status"],
            user_id = user_id,
            comment_id = comment_id
        )
        db.session.add(new_like)
        db.session.commit()
        
        return return_comment_like(new_like)
        
    return {"errors": validation_error_message(form.errors)}, 401


# update existing like to a comment
# TODO: Not sure how I'd get the id of the like, but if I figure it out, it would make the request faster
# could probably use a combination of the post id and the user id?
@comment_routes.route("/likes/<int:like_id>", methods=["PUT"])
@login_required
def update_like_on_comment(like_id):
    user_id = int(current_user.get_id())
    
    like_to_update = CommentLike.query.get(like_id)
    
    if like_to_update == None:
        return {"errors": ["Like/dislike does not exist"]}, 404
        
    if like_to_update.user_id != user_id:
        return {"errors": ["Current user is not authorized to update this like/dislike"]}, 403
    
    form = LikeForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if form.validate_on_submit():
        like_to_update.like_status = form.data["like_status"]
        db.session.commit()
        return return_comment_like(like_to_update)
    
    return {"errors": validation_error_message(form.errors)}, 401
    
    
# Delete likes/dislikes to comments
@comment_routes.route("/<int:comment_id>/likes", methods=["DELETE"])
@login_required
def delete_like_on_post(comment_id):
    user_id = int(current_user.get_id())
    
    like_to_delete = CommentLike.query.filter(CommentLike.comment_id == comment_id, CommentLike.user_id == user_id).first()
    
    if like_to_delete.user_id != user_id:
        return {"errors": ["This like/dislike does not belong to current user"]}, 403
    
    if like_to_delete == None:
       return {"errors": ["Current user is not authorized to delete this like/dislike"]}, 403
     
    db.session.delete(like_to_delete)
    db.session.commit()
    
    return {
        "id": like_to_delete.id,
        "message": "Like/dislike successfully deleted"
    }
