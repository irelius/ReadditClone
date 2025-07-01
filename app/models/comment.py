from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.orm import validates
import datetime

class Comment(db.Model):
    __tablename__ = "comments"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}


    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String, nullable=False)
    is_reply = db.Column(db.Boolean, nullable=True, default=False)
    deleted = db.Column(db.Boolean, nullable=True, default=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    replies_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("comments.id")), nullable=True, default=None)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("posts.id")), nullable=False)
    
    # One to Many Relationship, Unidirectional FROM Comment
    comment_likes = db.relationship("CommentLike", cascade="all, delete")
    replies = db.relationship("Comment")
    
    # Is this relationship necessary? Maybe for some advanced feature of searching for a comment within a subreddit
    subreddit_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("subreddits.id")), nullable=False)
    
    # One to Many relationship, Bidirectional TO Comment
    users = db.relationship("User", back_populates="comments")
    
    
    def calc_likes(self):       
        likes = len([like for like in self.comment_likes if like.like_status == "like"])
        dislikes = len([dislike for dislike in self.comment_likes if dislike.like_status == "dislike"])
        total = likes - dislikes        
        return likes, dislikes, total
        
    def flat_to_dict(self):
        likes, dislikes, total = self.calc_likes()
        
        replies_by_id = []
        
        for reply in self.replies:
            replies_by_id.append(reply.id)
        
        return {
            "id": self.id,
            "user_id": self.user_id,
            "users": self.users.safe_to_dict(),
            "post_id": self.post_id,
            "subreddit_id": self.subreddit_id,
            "body": self.body,
            "is_reply": self.is_reply,
            "likes": likes,
            "dislikes": dislikes,
            "total_likes": total,
            "replies_by_id": replies_by_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
        
        
    def to_dict(self):
        likes, dislikes, total = self.calc_likes()

        replies = {}
        replies_by_id = []
        
        for reply in self.replies:
            replies_by_id.append(reply.id)
            replies[reply.id] = reply.to_dict()

        return {
            "id": self.id,
            "user_id": self.user_id,
            "users": self.users.safe_to_dict(),
            "post_id": self.post_id,
            "subreddit_id": self.subreddit_id,
            "body": self.body,
            "is_reply": self.is_reply,
            "likes": likes,
            "dislikes": dislikes,
            "total_likes": total,
            "replies": replies,
            "replies_by_id": replies_by_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }