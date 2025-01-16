from app.models import db, Comment, environment, SCHEMA
from sqlalchemy.sql import text
from .comment_seed_data import comment_seed_data

def seed_comments():
    for x in comment_seed_data:
        new_comment = Comment(
            body=x["body"],
            deleted=x["deleted"],
            user_id=x["user_id"],
            post_id=x["post_id"],
            replies_id=x["replies_id"] if "replies_id" in x else None,
            subreddit_id=x["subreddit_id"]
        )
        db.session.add(new_comment)

    db.session.commit()

def undo_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM comments;"))

    db.session.commit()
