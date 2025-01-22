from flask_login import current_user
from app.models import User, Subreddit, Post, Comment

#  ---------------------------- General Helper Function ---------------------------
# Validation error function
def validation_error_message(validation_errors):
    error_messages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            error_messages.append({field : error})
    return error_messages


#  --------------------------- Subreddit Helper Function --------------------------
# Return subreddits based on length
def return_subreddits(subreddits):
    if len(subreddits) > 0:
        return {subreddit.id: subreddit.to_dict() for subreddit in subreddits}
    return {"errors": "Subreddits do not exist"}


#  ----------------------------- Post Helper Function -----------------------------
# Return posts based on length
def return_posts(posts):
    if len(posts) > 0:
        return {post.id: post.to_dict() for post in posts}
    return {"errors": "Posts do not exist"}, 404


#  ---------------------------- Comment Helper Function ----------------------------
# Return comments based on length
def return_comments(comments):
    if len(comments) > 0:
        return {comment.id: comment.to_dict() for comment in comments}
    return {"errors": "Comments do not exist"}