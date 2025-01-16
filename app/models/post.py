from .db import db, environment, SCHEMA, add_prefix_for_prod
import datetime

class Post(db.Model):
    __tablename__ = "posts"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(300), nullable=False)
    body = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    # TODO: add in a video functionality

    # One to Many Relationships, Unidirectional FROM Post
    post_likes = db.relationship("PostLike", cascade="all, delete")
    comments = db.relationship("Comment", cascade="all, delete")
    images = db.relationship("Image", cascade="all, delete")

    # Many to One Relationships, Unidirectional TO Post
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    subreddit_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("subreddits.id")), nullable=False)


    def calc_likes(self):
        likes = len([like for like in self.post_likes if like.like_status == "like"])
        dislikes = len([dislike for dislike in self.post_likes if dislike.like_status == "dislike"])
        total = likes - dislikes
        
        return likes, dislikes, total


    def to_dict(self):
        likes, dislikes, total = self.calc_likes()
        
        return {
            "id": self.id,
            "user_id": self.user_id,
            "subreddit_id": self.subreddit_id,
            "title": self.title,
            "body": self.body,
            "images":  {image.id: image.to_dict() for image in self.images},
            "likes": likes,
            "dislikes": dislikes,
            "total_likes": total,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
