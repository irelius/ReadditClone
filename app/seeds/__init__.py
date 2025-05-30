from flask.cli import AppGroup
from .users import seed_users, undo_users
from .subreddits import seed_subreddits, undo_subreddits
from .user_subreddits import seed_user_subreddits, undo_user_subreddits
from .posts import seed_posts, undo_posts
from .images import seed_images, undo_images
from .comments import seed_comments, undo_comments
from .post_likes import seed_post_likes, undo_post_likes
from .comment_likes import seed_comment_likes, undo_comment_likes

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_comment_likes()
        undo_post_likes()
        undo_comments()
        undo_images()
        undo_posts()
        undo_user_subreddits()
        undo_subreddits()
        undo_users()
    seed_users()
    seed_subreddits()
    seed_user_subreddits()
    seed_posts()
    seed_images()
    seed_comments()
    seed_post_likes()
    seed_comment_likes()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_comment_likes()
    undo_post_likes()
    undo_comments()
    undo_images()
    undo_posts()
    undo_user_subreddits()
    undo_subreddits()
    undo_users()
    # Add other undo functions here