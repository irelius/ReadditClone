from .db import db, environment, SCHEMA, add_prefix_for_prod
import datetime

class PostLike(db.Model):
    __tablename__ = "post_likes"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}


    id = db.Column(db.Integer, primary_key=True)
    like_status = db.Column(db.String, nullable=True, default="like")
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    # Many to One Relationships, Bidirection TO Like
    posts = db.relationship("Post", back_populates="post_likes")

    # Many to One Relationships, Undirection TO Like
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("posts.id")), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "post_id": self.post_id,
            # "post": self.posts.simple_to_dict(),
            "like_status": self.like_status,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
