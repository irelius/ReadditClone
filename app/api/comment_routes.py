from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Comment, User, Subreddit, CommentLike
from app.forms import PostCommentForm, ReplyCommentForm, UpdateCommentForm, LikeForm
from app.helper import return_comments, return_comments_flat, return_comment_likes, validation_error_message
from sqlalchemy.orm import joinedload, selectinload, aliased
from sqlalchemy import select, union_all

comment_routes = Blueprint("comments", __name__)

# ----------------------------------------------- Comment stuff -----------------------------------------------
# Get all comments
@comment_routes.route("/")
def comments_all():
    comments = Comment.query.options(joinedload(Comment.comment_likes), joinedload(Comment.users), joinedload(Comment.replies)).all()
    return return_comments_flat(comments)

# Get specific comment by id
@comment_routes.route("/<int:comment_id>")
def comments_specific(comment_id):
    comment_check = Comment.query.get(comment_id)
    
    if comment_check == None:
        return {"errors": ["Comment does not exist"]}, 404 
    
    parent = aliased(Comment)
    child = aliased(Comment)
    
    post_id = comment_check.post_id

    # have to use sqlalchemy core format because CTE doesn't work with the legacy sqlalchemy orm object format
    #   could just use regular recursion to get the comment tree, but that hits database too many times
    #   CTE allows for recursion in less database queries
    initial_comment = select(Comment.id).where(Comment.id == comment_id, Comment.post_id == post_id)
    
    recursive = select(child.id).where(
        child.replies_id == parent.id,
        child.post_id == post_id
    )

    cte = initial_comment.union_all(recursive).cte(name="comment_tree", recursive=True)
    
    final_query = (
        select(Comment)
        .where(Comment.id.in_(select(cte.c.id)))
        .options(selectinload(Comment.replies), selectinload(Comment.users), selectinload(Comment.comment_likes))
    )
    db.session.execute(final_query).scalars().all()

    comment_by_id = []
    all_comments = {}

    initial_comment = Comment.query.filter(Comment.id == comment_id, Comment.replies_id == None).all()
    for x in initial_comment:
        comment = x.to_dict()
        comment_by_id.append(comment['id'])
        all_comments[comment["id"]] = comment
    
    return {
        "comments_by_id": comment_by_id,
        "all_comments": all_comments
    }

# Create a new comment on a comment
# int:comment_id is the id of the comment that is being responded to
@comment_routes.route("/<int:comment_id>", methods=["POST"])
@login_required
def create_comment_on_comment(comment_id):
    user_id = int(current_user.get_id() or 0)

    comment_check = Comment.query.options(joinedload(Comment.replies)).get(comment_id)
    if comment_check == None:
        return {"errors": ["Comment does not exist to reply to"]}, 404

    if user_id == None:
        return {"errors": ["You must be logged in before leaving a comment"]}, 401

    form = ReplyCommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_comment = Comment(
            body = form.data["body"],
            is_reply = True,
            deleted = False,
            replies_id = comment_id,
            user_id = user_id,
            post_id = comment_check.post_id,
            subreddit_id = comment_check.subreddit_id,
        )

        db.session.add(new_comment)
        db.session.commit()

        return return_comments([new_comment])
    
    return {"errors": validation_error_message(form.errors)}, 401


# Update a comment
@comment_routes.route("/<int:comment_id>", methods=["PUT"])
@login_required
def comments_update_specific(comment_id):
    user_id = int(current_user.get_id() or 0)
    comment_to_edit = Comment.query.options(joinedload(Comment.comment_likes), joinedload(Comment.replies)).get(comment_id)

    if comment_to_edit == None:
        return {"errors": ["Comment does not exist to update"]}, 404

    if comment_to_edit.user_id != user_id:
        return {"errors": ["You do not have permission to edit this comment"]}, 403

    if comment_to_edit.deleted == True:
        return {"errors": ["You cannot change a deleted comment"]}, 403

    form = UpdateCommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if form.validate_on_submit():
        comment_to_edit.body = form.data["body"].strip(" ")
        db.session.commit()
        
        return return_comments([comment_to_edit])
    
    return {"errors": validation_error_message(form.errors)}, 401


# Delete a specific comment
# While not a true delete, doing this is necessary to keep the binary tree of comment structure 
@comment_routes.route("/<int:comment_id>", methods=["DELETE"])
@login_required
def comments_delete_specific(comment_id):
    user_id = int(current_user.get_id() or 0)
    comment_to_delete = Comment.query.options(joinedload(Comment.comment_likes), joinedload(Comment.replies)).get(comment_id)

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
    comment_check = Comment.query.options(joinedload(Comment.comment_likes), joinedload(Comment.replies)).get(comment_id)
    if comment_check == None:
        return {"errors": ["Comment does not exist."]}, 404
    
    comment_likes = CommentLike.query.filter(CommentLike.comment_id == comment_id).all()
    return return_comment_likes(comment_likes)


# handle when user likes/dislikes a comment. Technically handles POST, PUT, and DELETE
@comment_routes.route("/<int:comment_id>/likes", methods=["POST"])
@login_required
def handle_like_on_comment(comment_id):
    user_id = int(current_user.get_id() or 0)
    
    # check if comment exists
    comment_check = Comment.query.get(comment_id)
    if comment_check == None:
        return {"errors": ["Comment does not exist to like/dislike"]}, 404
    
    # check if user has a like/dislike on the comment already
    existing_like = CommentLike.query.filter(CommentLike.comment_id == comment_id, CommentLike.user_id == user_id).first()
    
    # get the form data being sent by user
    form = LikeForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    request_like_value = form.data["like_status"]

    if form.validate_on_submit():
        # POST: if like/dislike on comment doesn't exist, create the like or dislike as a new row
        if existing_like == None:
            new_like = CommentLike(
                like_status = request_like_value,
                comment_id = comment_id,
                user_id = user_id,
                post_id = comment_check.post_id
            )
            
            db.session.add(new_like)
            db.session.commit()
            
            return return_comment_likes([new_like], "CREATE")
        
        # if like/dislike already exists for comment, manipulate the currently existing row in the database
        # exact manipulation depends on the action done by the user
        else:
            curr_like_status = existing_like.like_status
            deleting_like = True if request_like_value == curr_like_status else False
            
            # DELETE: liking a liked comment or disliking a disliked comment, delete the existing row to undo the like/dislike
            if deleting_like == True:
                if existing_like.user_id != user_id:
                    return {"errors": ["You do not have permission to delete this like/dislike"]}, 403               
                
                db.session.delete(existing_like)
                db.session.commit()
                
                return {
                    "id": existing_like.id,
                    "message": "Like/dislike on comment successfully deleted",
                    "like_status": None,
                    "action_type": "DELETE"
                }
                
            # PUT: liking a disliked comment or disliking a liked comment, edit the existing row to change like value
            else:
                if existing_like.user_id != user_id:
                    return {"errors": ["You do not have permission to edit this like/dislike"]}, 403
                
                existing_like.like_status = request_like_value
                db.session.commit()
                return return_comment_likes([existing_like], "UPDATE")

    return {"errors": validation_error_message(form.errors)}, 401