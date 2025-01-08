from .db import db, environment, SCHEMA, add_prefix_for_prod
import datetime

class Comment(db.Model):
    __tablename__ = "comments"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}


    id = db.Column(db.Integer, primary_key=True)
    reply_to_id = db.Column(db.Integer, nullable=True)
    body = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    # One to Many Relationship, Unidirectional FROM Comment
    comment_likes = db.relationship("CommentLike", cascade="all, delete")

    # Many to One Relationship, Unidirectional TO Comment
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("posts.id")), nullable=False)
    subreddit_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("subreddits.id")), nullable=False)


    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "post_id": self.post_id,
            "subreddit_id": self.subreddit_id,
            "reply_to_id": self.reply_to_id,
            "body": self.body,
            # "comment_likes": {comment_likes.id: comment_likes.to_dict() for comment_likes in self.comment_likes if comment_likes.like_status == "like"},
            # "comment_dislikes": {comment_likes.id: comment_likes.to_dict() for comment_likes in self.comment_likes if comment_likes.like_status == "dislike"},
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
