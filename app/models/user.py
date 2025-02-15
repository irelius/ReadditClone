from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
import datetime


class User(db.Model, UserMixin):
    __tablename__ = "users"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    
    profile_image = db.Column(db.String(255), nullable=True, default="https://www.redditstatic.com/avatars/avatar_default_01_A5A4A4.png")
    
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)


    # One to Many Relationships, Unidirectional FROM User
    post_likes = db.relationship("PostLike", cascade="all, delete")
    comments = db.relationship("Comment", cascade="all, delete")
    comment_likes = db.relationship("CommentLike", cascade="all, delete")

    # One to Many relationship, Bidirectional to Users
    posts = db.relationship("Post", back_populates="users", cascade="all, delete")

    # Many to Many Relationship. Bidirectional through join table UserSubreddit   
    subreddit_relationship = db.relationship("UserSubreddit", back_populates="user_join", cascade="all, delete")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)
    
    def safe_to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "profile_image": self.profile_image,
        }

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            # "subreddits": {subreddit.subreddit_id: subreddit.to_dict() for subreddit in self.user_subreddit_relationship},
            "profile_image": self.profile_image,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }