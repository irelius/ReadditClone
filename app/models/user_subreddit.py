from .db import db, environment, SCHEMA, add_prefix_for_prod
import datetime


class UserSubreddit(db.Model):
    __tablename__ = "user_subreddits"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    admin_status = db.Column(db.Boolean, nullable=False)
    mod_status = db.Column(db.Boolean, nullable=True, default=False)
    
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    subreddit_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("subreddits.id")), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    # Join Table association between User and Subreddit tables 
    user_join = db.relationship("User", back_populates="subreddit_relationship")
    subreddit_join = db.relationship("Subreddit", back_populates="user_relationship")

    # method to return subreddit(s) data. used for database queries when user is parent
    def subreddit_data_dict(self):
        return self.subreddit_join.to_dict()
        
    
    # method to return user(s) data. used for database queries when subreddit is parent
    def user_data_dict(self):
        return {
            "user_data": self.user_join.safe_to_dict(),
            "admin_status": self.admin_status,
            "mod_status": self.mod_status,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }

    def to_dict(self):
        return {
            # "subreddit_id": self.subreddit_id,
            # "user_id": self.user_id,
            "admin_status": self.admin_status,
            "mod_status": self.mod_status,
            "user": {user.id: user.to_safe_dict() for user in self.user_join},
            "subreddit": {subreddit.id: subreddit.to_dict() for subreddit in self.subreddit_join},
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
