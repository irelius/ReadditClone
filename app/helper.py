#  ---------------------------- General Helper Function ---------------------------
# Validation error function
def validation_error_message(validation_errors):
    error_messages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            error_messages.append(f'{field} : {error}')
    return error_messages


#  --------------------------- Subreddit Helper Function --------------------------
# Return subreddits based on length
def return_subreddits(subreddits):
    if len(subreddits) > 0:
        return {"subreddits": {subreddit.id: subreddit.to_dict() for subreddit in subreddits}}
    return {"subreddits": "No subreddits"}


#  ----------------------------- Post Helper Function -----------------------------
# Return posts based on length
def return_posts(posts):
    if len(posts) > 0:
        return {"posts": {post.id: post.to_dict() for post in posts}}
    return {"posts": "No posts"}
