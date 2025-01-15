from app.models import db, CommentLike, environment, SCHEMA
from sqlalchemy.sql import text
from .comment_like_seed_data import comment_like_seed_data

def seed_comment_likes():
    for x in comment_like_seed_data:
        new_comment_like = CommentLike(
            like_status= x["like_status"],
            user_id= x["user_id"],
            comment_id= x["comment_id"] 
        )
        db.session.add(new_comment_like)

    db.session.commit()


def undo_comment_likes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comment_likes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM comment_likes;"))

    db.session.commit()
