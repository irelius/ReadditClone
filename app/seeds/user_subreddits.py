from app.models import db, UserSubreddit, environment, SCHEMA
from sqlalchemy.sql import text

from .user_subreddit_seed_data import user_subreddit_seed_data

def seed_user_subreddits():
    for x in user_subreddit_seed_data:
        new_user_subreddit = UserSubreddit(
            admin_status=x["admin_status"],
            mod_status=x["mod_status"],
            user_id=x["user_id"],
            subreddit_id=x["subreddit_id"]
        )
        db.session.add(new_user_subreddit)
        
    db.session.commit()


def undo_user_subreddits():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.user_subreddits RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM user_subreddits;"))
        
    db.session.commit()
