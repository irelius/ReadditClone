from .db import db, environment, SCHEMA, add_prefix_for_prod
import datetime

class Subreddit(db.Model):
    __tablename__ = "subreddits"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}


    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(21), unique=True, nullable=False)
    # TODO: add a function to make a subreddit private
    description = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    # One to Many Relationship, Unidirectional FROM Subreddit
    posts = db.relationship("Post", cascade="all, delete")

    # Many to Many Relationship. Bidirectional through join table UserSubreddit
    user_relationship = db.relationship("UserSubreddit", back_populates="subreddit_join", cascade="all, delete")
    
    
    def all_data(self):
        return {           
            "id": self.id,
            "name": self.name,
            "users": {user_sub.user_id: user_sub.user_data_dict() for user_sub in self.user_relationship},
            "description": self.description,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
    
    def to_dict(self):               
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }