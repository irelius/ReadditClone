from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Comment, User, Subreddit, CommentLike
from app.forms import CommentForm, LikeForm
from app.helper import return_comments, validation_error_message

comment_routes = Blueprint("comments", __name__)


# Get all comments
@comment_routes.route("/")
def comments_all():
    comments = Comment.query.all()
    return return_comments(comments)


# Get specific comment by id
@comment_routes.route("/<int:comment_id>")
def comments_specific(comment_id):
    comment = Comment.query.get(comment_id)
    if comment == None:
        return {"errors": "Comment does not exist"}, 404
    return {"comments": {comment_id: comment.to_dict()}}


# Create a new comment on a comment
@comment_routes.route("/<int:comment_id>", methods=["POST"])
@login_required
def create_comment_on_comment(comment_id):
    user_id = int(current_user.get_id())

    if user_id == None:
        return {"errors": "You must be logged in before leaving a comment"}, 401

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

        return new_comment.to_dict()

    return {"errors": validation_error_message(form.errors)}, 401


# Create a like/dislike to a comment
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

        return new_like.to_dict()
    return {"errors": validation_error_message(form.errors)}, 401


# update existing like to a comment
# TODO: Not sure how I'd get the id of the like, but if I figure it out, it would make the request faster
@comment_routes.route("/likes/<int:like_id>", methods=["PUT"])
@login_required
def update_like_on_comment(like_id):
    user_id = int(current_user.get_id())
    
    like_to_update = CommentLike.query.get(like_id)
    
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
    
    
# Delete likes/dislikes to comments
@comment_routes.route("/<int:comment_id>/likes", methods=["DELETE"])
@login_required
def delete_like_on_post(comment_id):
    user_id = int(current_user.get_id())
    
    like_to_delete = CommentLike.query.filter(CommentLike.comment_id == comment_id, CommentLike.user_id == user_id).first()
    
    if like_to_delete.user_id != user_id:
        return {"errors": "This like/dislike does not belong to current user"}, 403
    
    if like_to_delete == None:
       return {"errors": "Current user is not authorized to delete this like/dislike"}, 403
     
    db.session.delete(like_to_delete)
    db.session.commit()
    
    return {"message": "Like/dislike successfully deleted"}


# Update a specific comment
@comment_routes.route("/<int:comment_id>", methods=["PUT"])
@login_required
def comments_update_specific(comment_id):
    user_id = int(current_user.get_id())
    comment_to_edit = Comment.query.get(comment_id)

    if user_id == None:
        return {"errors": "You must be logged in before leaving a comment"}, 401

    if comment_to_edit.user_id != user_id:
        return {"errors": "You do not have permission to edit this comment"}, 403

    form = CommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if form.validate_on_submit():
        comment_to_edit.body = form.data["body"]
        db.session.commit()
        
        return comment_to_edit.to_dict()
    
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
        return {"errors": f"Comment {comment_id} does not exist"}, 404
       
    if comment_to_delete.user_id != user_id and subreddit.admin_id != user_id:
        return {"errors": "You are not authorized to delete this comment."}, 403

    # While not a true delete, doing this is necessary to keep the binary tree of comment structure 
    comment_to_delete.deleted = True
    
    if comment_to_delete.user_id == user_id:    
        comment_to_delete.body = "Comment deleted by user."
    elif subreddit.admin_id == user_id:
        comment_to_delete.body = "Comment removed by admin."
    
    db.session.commit()

    return {"message": "Comment successfully deleted."}