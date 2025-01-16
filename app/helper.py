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

# def check_subreddit(id):
#     subreddit = Subreddit.query.get(id)
#     if subreddit == None:
#         return {"errors": "Subreddit does not exist."}, 404


#  ----------------------------- Post Helper Function -----------------------------
# Return posts based on length
def return_posts(posts):
    if len(posts) > 0:
        return {post.id: post.to_dict() for post in posts}
    return {"errors": "Posts do not exist"}, 404

# def check_post(id):
#     post = Post.query.get(id)
#     if post == None:
#         return {"errors": "Post does not exist."}, 404


#  --------------------------- PostLike Helper Function ---------------------------
# Return Likes helper function
def return_likes(id, likes, dislikes):
    likes_total = len(likes) - len(dislikes)
    return {
        id: {
            "likes_total": likes_total,
            "likes": {like.id: like.to_dict() for like in likes},
            "dislikes": {dislike.id: dislike.to_dict() for dislike in dislikes}
        }
    }
    
    
#  ---------------------------- Comment Helper Function ----------------------------
# Return comments based on length
def return_comments(comments):
    if len(comments) > 0:
        return {comment.id: comment.to_dict() for comment in comments}
    return {"errors": "Comments do not exist"}

# def check_comment(id):
#     comment = Comment.query.get(id)
#     if comment == None:
#         return {"errors": "Comment does not exist."}, 404