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
    subreddits = db.relationship("Comment")
    
    # One to Many relationship, Bidirection
    posts = db.relationship("Post", cascade="all, delete", back_populates="subreddits")
    

    # Many to Many Relationship. Bidirectional through join table UserSubreddit
    user_relationship = db.relationship("UserSubreddit", back_populates="subreddit_join", cascade="all, delete")
        
    def to_dict(self):               
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }