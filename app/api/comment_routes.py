from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Comment, User, Subreddit
from app.forms import CommentForm
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
    return {"comments": {comment_id: comment.to_dict()}}

# Get comments made by current user
@comment_routes.route("/users/current")
@login_required
def comments_by_current_user():
    current_user_id = int(current_user.get_id())
    comments = Comment.query.filter(Comment.user_id == current_user_id).all()
    return return_comments(comments)

# Get comments made by specific user
@comment_routes.route("/users/<int:user_id>")
def comments_by_specific_user_id(user_id):
    comments = Comment.query.filter(Comment.user_id == user_id).all()
    return return_comments(comments)

# Get comments made to a specific post
@comment_routes.route("/posts/<int:post_id>")
def comments_by_specific_post(post_id):
    comments = Comment.query.filter(Comment.post_id == post_id).all()
    return return_comments(comments)


# Get comments made to a specific subreddit, this route doesn't seem all that useful
# @comment_routes.route("/subreddits/<int:subreddit_id>")
# def comments_by_specific_subreddit(subreddit_id):
#     comments = Comment.query.filter(Comment.subreddit_id == subreddit_id).all()
#     return return_comments(comments)



# Create a new comment on a comment
@comment_routes.route("/<int:comment_id>", methods=["POST"])
@login_required
def create_comment_on_comment(comment_id):
    current_user_id = int(current_user.get_id())

    if current_user_id == None:
        return {"errors": "You must be logged in before leaving a comment"}, 401

    form = CommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_comment = Comment(
            body = form.data["body"],
            deleted = False,
            reply_to_id = comment_id,
            user_id = current_user_id,
            post_id = form.data["post_id"],
            subreddit_id = form.data["subreddit_id"],
        )

        db.session.add(new_comment)
        db.session.commit()

        return new_comment.to_dict()

    return {"errors": validation_error_message(form.errors)}, 401


# Update a specific comment
@comment_routes.route("/<int:comment_id>", methods=["PUT"])
@login_required
def comments_update_specific(comment_id):
    current_user_id = int(current_user.get_id())
    comment_to_edit = Comment.query.get(comment_id)

    if current_user_id == None:
        return {"errors": "You must be logged in before leaving a comment"}, 401

    if comment_to_edit.user_id != current_user_id:
        return {"errors": "You do not have permission to edit this comment"}, 403

    form = CommentForm()
    comment_to_edit.body = form.data["body"]

    db.session.commit()
    return comment_to_edit.to_dict()

# Delete a specific comment
# While not a true delete, doing this is necessary to keep the binary tree of comment structure 
@comment_routes.route("/<int:comment_id>", methods=["DELETE"])
@login_required
def comments_delete_specific(comment_id):
    current_user_id = int(current_user.get_id())
    comment_to_delete = Comment.query.get(comment_id)
    subreddit = Subreddit.query.get(comment_to_delete.subreddit_id)

    if comment_to_delete == None:
        return {"errors": f"Comment {comment_id} does not exist"}, 404
       
    if comment_to_delete.user_id != current_user_id and subreddit.admin_id != current_user_id:
        return {"errors": "You do not have authorization to delete this comment."}, 403

    # While not a true delete, doing this is necessary to keep the binary tree of comment structure 
    comment_to_delete.deleted = True
    comment_to_delete.body = "Comment deleted by user."
    db.session.commit()

    return {"message": "Comment successfully deleted."}