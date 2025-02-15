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

#  ----------------------------- User Helper Function ----------------------------
# return one user
def return_user(user):
    if user == None:
        return {"errors": ["User does not exist"]}, 404
    
    return {
        "users_by_id": [user.id],
        "all_users": {user.id: user.safe_to_dict()}
    }

# return users
def return_users(users):
    user_by_id = []
    all_user = {}

    for user in users:
        user_by_id.append(user.id)
        all_user[user.id] = user.safe_to_dict()
    
    return {
        "users_by_id": user_by_id,
        "all_users": all_user
    }
    
#  --------------------------- User Sub Helper Function --------------------------
# return one user sub. data prepped according to "type"
def return_user_sub(user_sub, type):
    if user_sub == None:
        return {"errors": ["User sub does not exist"]}, 404
    
    return {
        "user_subs_by_id": [user_sub.id],
        "all_user_subs": {user_sub.id: user_sub.subreddit_data_dict() if type == "subreddit" else user_sub.user_data_dict()}
    }
    
# return user subs. data prepped according to "type"
def return_user_subs(user_subs, type):
    user_subs_by_id = []
    all_user_subs = {}
    
    for user_sub in user_subs:
        user_subs_by_id.append(user_sub.id)
        
        if type == "subreddit":
            all_user_subs[user_sub.id] = user_sub.subreddit_data_dict()
        if type == "user":
            all_user_subs[user_sub.id] = user_sub.user_data_dict()
            
    return {
        "user_subs_by_id": user_subs_by_id,
        "all_user_subs": all_user_subs
    }


#  --------------------------- Subreddit Helper Function --------------------------
# return one subreddit
def return_subreddit(subreddit):
    if subreddit == None:
        return {"errors": ["Subreddit does not exist."]}, 404
    
    return {
        "subreddits_by_id": [subreddit.id],
        "all_subreddits": {subreddit.id: subreddit.to_dict()}
    }


# Return subreddits
def return_subreddits(subreddits):  
    subreddit_by_id = []
    all_subreddits = {}

    for subreddit in subreddits:
        subreddit_by_id.append(subreddit.id)
        all_subreddits[subreddit.id] = subreddit.to_dict()
    
    return {
        "subreddits_by_id": subreddit_by_id,
        "all_subreddits": all_subreddits
    }


#  ----------------------------- Post Helper Function -----------------------------
# return one post
def return_post(post):
    if post == None:
        return {"errors": ["Post does not exist."]}, 404
    
    return {
        "posts_by_id": [post.id],
        "all_posts": {post.id: post.to_dict()}
    }
    
# Return posts
def return_posts(posts):   
    post_by_id = []
    all_posts = {}
    
    for post in posts:
        post_by_id.append(post.id)
        all_posts[post.id] = post.to_dict()
    
    return {
        "posts_by_id": post_by_id,
        "all_posts": all_posts
    }

#  -------------------------- Post Likes Helper Function --------------------------
# return post like
def return_post_like(post_like):
    if post_like == None:
        return {"errors": ["Like on post does not exist"]}, 404

    return {
        "post_likes_by_id": [post_like.id],
        "all_post_likes": {post_like.id: post_like.to_dict()}
    }

# Return posts likes
def return_post_likes(post_likes):   
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
# return one comment
def return_comment(comment):
    if comment == None:
        return {"errors": ["Comment does not exist"]}, 404
    
    return {
        "comments_by_id": [comment.id],
        "all_comments": {comment.id: comment.to_dict()}
    }

# Return comments based on length
def return_comments(comments):    
    comment_by_id = []
    all_comments = {}
    
    for comment in comments:
        comment_by_id.append(comment.id)
        all_comments[comment.id] = comment.to_dict()

    return {
        "comments_by_id": comment_by_id,
        "all_comments": all_comments
    }
    
#  ------------------------- Comment Likes Helper Function -------------------------
# return one comment like
def return_comment_like(comment_like):
    if comment_like == None:
        return {"errors": ["Like on comment does not exist"]}, 404

    return {
        "comment_likes_by_id": [comment_like.id],
        "all_comment_likes": {comment_like.id: comment_like.to_dict()}
    }

# Return comment likes
def return_comment_likes(comment_likes):    
    comment_likes_by_id = []
    all_comment_likes = {}
    
    for comment in comment_likes:
        comment_likes_by_id.append(comment.id)
        all_comment_likes[comment.id] = comment.to_dict()
    
    return {
        "comment_likes_by_id": comment_likes_by_id,
        "all_comment_likes": all_comment_likes
    }