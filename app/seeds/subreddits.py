from app.models import db, Subreddit, environment, SCHEMA
from sqlalchemy.sql import text

from .subreddit_seed_data import subreddit_seed_data

def seed_subreddits():
    for x in subreddit_seed_data:
        new_subreddit = Subreddit(
            name=x["name"],
            description=x["description"]
        )
        db.session.add(new_subreddit)

    db.session.commit()

def undo_subreddits():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.subreddits RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM subreddits;"))

    db.session.commit()
