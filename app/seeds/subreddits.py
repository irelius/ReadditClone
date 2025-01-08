from app.models import db, Subreddit, environment, SCHEMA
from sqlalchemy.sql import text

def seed_subreddits():
    subreaddit_one = Subreddit(
        name = "Ephemeral",
        admin_id = 1,
        description = "A space for discussing and sharing fleeting moments, experiences, or things that are temporary but hold a special place in our hearts."
    )
    subreaddit_two = Subreddit(
        name = "Gloomscape",
        admin_id = 5,
        description = "A community focused on sharing and discussing moody or atmospheric scenes and settings, inspired by literature, art, or personal experiences."
    )
    subreaddit_three = Subreddit(
        name = "FutureFashionFail",
        admin_id = 5,
        description = "A lighthearted space for users to share humorous or creative fashion concepts that might be considered avant-garde or futuristic, even if they're impractical or unlikely to catch on."
    )
    subreaddit_four = Subreddit(
        name = "AccidentalTimeTravel",
        description = "A subreddit for sharing and discussing stories or experiences of people who stumbled upon unexpected time travel, whether in dreams, daydreams, or peculiar real-life situations.",
        admin_id = 1
    )

    db.session.add(subreaddit_one)
    db.session.add(subreaddit_two)
    db.session.add(subreaddit_three)
    db.session.add(subreaddit_four)

    db.session.commit()

def undo_subreddits():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.subreddits RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM subreddits;"))

    db.session.commit()
