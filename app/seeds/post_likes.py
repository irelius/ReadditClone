from app.models import db, PostLike, environment, SCHEMA
from sqlalchemy.sql import text

from .post_like_seed_data import post_like_seed_data

def seed_post_likes():
    for x in post_like_seed_data:
        new_post_like = PostLike(
            like_status=x["like_status"],
            user_id=x["user_id"],
            post_id=x["post_id"]
        )
        db.session.add(new_post_like)

    db.session.commit()


def undo_post_likes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.post_likes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM post_likes;"))

    db.session.commit()
