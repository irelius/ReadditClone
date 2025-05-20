from flask_login import current_user
from app.models import User, Subreddit, Post, Comment

#  ---------------------------- General Helper Function ---------------------------
# Validation error function
def validation_error_message(validation_errors):
    error_messages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            error_messages.append(error)
            
    return validation_errors
    return error_messages

#  ----------------------------- User Helper Function ----------------------------
# returns "users_by_id" and "all_users"
def return_users(users):    
    if users[0] == None:
        return {"errors": ["User does not exist"]}, 404
    
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
# when getting user data: returns "users_by_id" and "all_users"
# when getting subreddit data: returns "subreddits_by_id" and "all_subreddits"
# return user subs. data prepped according to "type"
def return_user_subs(user_subs, type):
    if user_subs[0] == None:
        return {"errors": ["User sub does not exist"]}, 404
    
    user_subs_by_id = []
    all_user_subs = {}
    
    for user_sub in user_subs:
        user_subs_by_id.append(user_sub.id)
        
        if type == "subreddit":
            all_user_subs[user_sub.id] = user_sub.subreddit_data_dict()
        if type == "user":
            all_user_subs[user_sub.id] = user_sub.user_data_dict()     
    
    # if type is subreddit: getting subreddits of a user
    if type == "subreddit":
        return {
            "subreddits_by_id": user_subs_by_id,
            "all_subreddits": all_user_subs
        }
    
    # if type is user: getting users of a subreddit
    if type == "user":
        return {
            "users_by_id": user_subs_by_id,
            "all_users": all_user_subs
        }


#  --------------------------- Subreddit Helper Function --------------------------
# returns "subreddits_by_id" and "all_subreddits"
def return_subreddits(subreddits):
    if subreddits[0] == None:
        return {"errors": ["Subreddit does not exist."]}, 404
    
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
# returns "posts_by_id" and "all_posts"
def return_posts(posts):  
    if posts[0] == None:
        return {"errors": ["Post does not exist."]}, 404
     
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
# returns "post_likes_by_id" and "all_post_likes"
def return_post_likes(post_likes):
    liked_posts = {}
    post_likes_by_id = []
    all_post_likes = {}
    
    if len(post_likes) == 0:
        return {
            "liked_posts": {},
            "post_likes_by_id": post_likes_by_id,
            "all_post_likes": all_post_likes
        }
    
    if post_likes[0] == None:
        return {"errors": ["Like on post does not exist"]}, 404
    
    for post_like in post_likes:
        liked_posts[post_like.post_id] = post_like.like_status
        post_likes_by_id.append(post_like.id)
        all_post_likes[post_like.id] = post_like.to_dict()
    
    return {
        "liked_posts": liked_posts,
        "post_likes_by_id": post_likes_by_id,
        "all_post_likes": all_post_likes
    }


#  ---------------------------- Comment Helper Function ----------------------------
# returns "comments_by_id" and "all_comments"
def return_comments(comments):
    if comments[0] == None:
        return {"errors": ["Comment does not exist"]}, 404

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
# returns "comment_likes_by_id" and "all_comment_likes"
def return_comment_likes(comment_likes):
    if comment_likes[0] == None:
        return {"errors": ["Like on comment does not exist"]}, 404
    
    comment_likes_by_id = []
    all_comment_likes = {}
    
    for comment in comment_likes:
        comment_likes_by_id.append(comment.id)
        all_comment_likes[comment.id] = comment.to_dict()
    
    return {
        "comment_likes_by_id": comment_likes_by_id,
        "all_comment_likes": all_comment_likes
    }