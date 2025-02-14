from flask_login import current_user
from app.models import User, Subreddit, Post, Comment

#  ---------------------------- General Helper Function ---------------------------
# Validation error function
def validation_error_message(validation_errors):
    error_messages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            error_messages.append(error)
    return error_messages

#  --------------------------- User Helper Function --------------------------
def return_users(users):
    if len(users) == 0:
        return {"errors": ["Users do not exist"]}, 404
    
    user_by_id = []
    all_user = {}

    for user in users:
        user_by_id.append(user.id)
        all_user[user.id] = user.to_dict()
    
    return {
        "user_by_id": user_by_id,
        "all_user": all_user
    }

#  --------------------------- Subreddit Helper Function --------------------------
# Return subreddits based on length
def return_subreddits(subreddits):
    if len(subreddits) == 0:
        return {"errors": ["Subreddits do not exist"]}, 404
    
    subreddit_by_id = []
    all_subreddits = {}

    for subreddit in subreddits:
        subreddit_by_id.append(subreddit.id)
        all_subreddits[subreddit.id] = subreddit.to_dict()
    
    return {
        "subreddit_by_id": subreddit_by_id,
        "all_subreddits": all_subreddits
    }


#  ----------------------------- Post Helper Function -----------------------------
# Return posts based on length
def return_posts(posts):
    if len(posts) ==  0:
        return {"errors": ["Posts do not exist"]}, 404
    
    post_by_id = []
    all_posts = {}
    
    for post in posts:
        post_by_id.append(post.id)
        all_posts[post.id] = post.to_dict()
    
    return {
        "post_by_id": post_by_id,
        "all_posts": all_posts
    }

#  -------------------------- Post Likes Helper Function --------------------------
# Return posts likes
def return_post_likes(post_likes):
    if len(post_likes) ==  0:
        return {"errors": ["Post likes do not exist"]}, 404
    
    post_likes_by_id = []
    all_post_likes = {}
    
    for post_like in post_likes:
        post_likes_by_id.append(post_like.id)
        all_post_likes[post_like.id] = post_like.to_dict()
    
    return {
        "post_likes_by_id": post_likes_by_id,
        "all_post_likes": all_post_likes
    }


#  ---------------------------- Comment Helper Function ----------------------------
# Return comments based on length
def return_comments(comments):
    if len(comments) == 0:
        return {"errors": ["Comments do not exist"]}, 404
    
    comment_by_id = []
    all_comments = {}
    
    for comment in comments:
        comment_by_id.append(comment.id)
        all_comments[comment.id] = comment.to_dict()

    return {
        "comment_by_id": comment_by_id,
        "all_comments": all_comments
    }
    
#  ------------------------- Comment Likes Helper Function -------------------------
# Return comment likes
def return_comment_likes(comment_likes):
    if len(comment_likes) ==  0:
        return {"errors": ["Comment likes do not exist"]}, 404
    
    comment_likes_by_id = []
    all_comment_likes = {}
    
    for comment in comment_likes:
        comment_likes_by_id.append(comment.id)
        all_comment_likes[comment.id] = comment.to_dict()
    
    return {
        "comment_likes_by_id": comment_likes_by_id,
        "all_comment_likes": all_comment_likes
    }