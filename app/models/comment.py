from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.orm import validates
import datetime

class Comment(db.Model):
    __tablename__ = "comments"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}


    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String, nullable=False)
    deleted = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    # One to Many Relationship, Unidirectional FROM Comment
    comment_likes = db.relationship("CommentLike", cascade="all, delete")
    replies = db.relationship("Comment")
    
    replies_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("comments.id")), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("posts.id")), nullable=False)
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "post_id": self.post_id,
            "body": self.body,
            "replies": {reply.id: reply.to_dict() for reply in self.replies},
            "comment_like": {comment_like.id: comment_like.to_dict() for comment_like in self.comment_likes},
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }