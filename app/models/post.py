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
    comments = db.relationship("Comment", cascade="all, delete")
    images = db.relationship("Image", cascade="all, delete")
    
    # One to Many relationship, Bidirectional FROM Post
    post_likes = db.relationship("PostLike", back_populates="posts", cascade="all, delete")
    
    # One to Many relationship, Bidirectional TO Post
    users = db.relationship("User", back_populates="posts")
    subreddits = db.relationship("Subreddit", back_populates="posts")

    # Many to One Relationships, Unidirectional TO Post
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    subreddit_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("subreddits.id")), nullable=False)


    def calc_likes(self):
        likes = len([like for like in self.post_likes if like.like_status == "like"])
        dislikes = len([dislike for dislike in self.post_likes if dislike.like_status == "dislike"])
        total = likes - dislikes
        return likes, dislikes, total

    def simple_to_dict(self):
        likes, dislikes, total = self.calc_likes()            
        
        return {
            "id": self.id,
            "user_id": self.user_id,
            "users": self.users.safe_to_dict(),
            "subreddit_id": self.subreddit_id,
            "title": self.title,
            "body": self.body,
            "likes": likes,
            "dislikes": dislikes,
            "total_likes": total,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }


    def to_dict(self):
        likes, dislikes, total = self.calc_likes()
        
        return_images = {
            "images_by_id": [],
            "images": {}
        }

        for x in self.images:
            image = x.to_dict()
            id = image["id"]
            return_images["images"][id] = image
            return_images["images_by_id"].append(id)
            
        
        return {
            "id": self.id,
            "user_id": self.user_id,
            "users": self.users.safe_to_dict(),
            "subreddit_id": self.subreddit_id,
            "subreddits": self.subreddits.to_dict(),
            "title": self.title,
            "body": self.body,
            "images": return_images,
            "likes": likes,
            "dislikes": dislikes,
            "total_likes": total,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "comments_count": len(self.comments)
        }
