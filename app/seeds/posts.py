from app.models import db, Post, environment, SCHEMA
from sqlalchemy.sql import text

from .post_seed_data import post_seed_data

def seed_posts():
    for x in post_seed_data:
        new_post = Post(
            title=x["title"],
            body=x["body"],
            user_id=x["user_id"],
            subreddit_id=x["subreddit_id"],
        )
        
        db.session.add(new_post)
    
    db.session.commit()


def undo_posts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.posts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM posts;"))

    db.session.commit()
