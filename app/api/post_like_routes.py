from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, PostLike, Comment
from app.forms import LikeForm
from app.helper import return_likes, validation_error_message

post_like_routes = Blueprint("post_likes", __name__)

# --------------------------------------------------------------------------------

# # Get all likes and dislikes made to comments for comments that belong to a specific post
# # @post_like_routes.route('/all/post/<int:post_id>/comments')
# @post_like_routes.route("/")
# @login_required
# def likes_comments_per_post(post_id):
#     user_id = int(current_user.get_id())

#     # likes = PostLike.query.filter(PostLike.like_status == "like").filter(PostLike.post_id == post_id).filter(PostLike.comment_id == 11).all()
#     # dislikes = PostLike.query.filter(PostLike.like_status == "dislike").filter(PostLike.post_id == post_id).filter(PostLike.comment_id == 11).all()

#     # test = db.query(Like, Comment).join(Comment)

#     likes = PostLike.query.filter(PostLike.like_status == "like").filter(PostLike.comment_id != None).filter(Comment.post_id == post_id).all()
#     dislikes = PostLike.query.filter(PostLike.like_status == "dislike").filter(PostLike.comment_id != None).filter(Comment.post_id == post_id).all()

#     comment = Comment.query.filter(Comment.post_id == post_id).all()

#     # return return_likes(user_id, likes, dislikes)


# # Get all likes and dislikes made by current user to posts
# @post_like_routes.route("/users/current")
# @login_required
# def likes_current_user():
#     user_id = int(current_user.get_id())
#     likes = PostLike.query.filter(PostLike.like_status == "like").filter(PostLike.user_id == user_id).all()
#     dislikes = PostLike.query.filter(PostLike.like_status == "dislike").filter(PostLike.user_id == user_id).all()

#     return return_likes(user_id, likes, dislikes)


# # Get all likes and dislikes made by specific user to posts
# @post_like_routes.route("/users/<int:user_id>")
# def likes_specific_user(user_id):
#     likes = PostLike.query.filter(PostLike.like_status == "like").filter(PostLike.user_id == user_id).all()
#     dislikes = PostLike.query.filter(PostLike.like_status == "dislike").filter(PostLike.user_id == user_id).all()

#     return return_likes(user_id, likes, dislikes)


# # Get all likes and dislikes made to a specific post
# @post_like_routes.route("/posts/<int:post_id>")
# def likes_specific_post(post_id):
#     likes = PostLike.query.filter(PostLike.like_status == "like").filter(PostLike.post_id == post_id).all()
#     dislikes = PostLike.query.filter(PostLike.like_status == "dislike").filter(PostLike.post_id == post_id).all()

#     return return_likes(post_id, likes, dislikes)


# Create a like/dislike to a post
@post_like_routes.route("/posts/<int:post_id>", methods=["POST"])
@login_required
def create_like_on_post(post_id):
    user_id = int(current_user.get_id())

    if user_id == None:
        return {"errors": "You must be logged in before liking/disliking a post"}, 401

    form = LikeForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    new_like = PostLike(
        like_status = form.data["like_status"],
        post_id = post_id,
        user_id = user_id
    )

    db.session.add(new_like)
    db.session.commit()

    return new_like.to_dict()


# Update specific post like status to neutral
# @post_like_routes.route("/posts/<int:post_id>", methods=["PUT"])
# @login_required
# def likes_update_to_post(post_id):
#     user_id = int(current_user.get_id())
#     like_to_edit_post = PostLike.query.filter((PostLike.post_id == int(post_id)), (PostLike.user_id == user_id)).all()[0]

#     if user_id == None:
#         return {"errors": "You must be logged in before liking/disliking a post"}, 401

#     like_to_edit_post.like_status = "neutral"

#     db.session.commit()

#     return like_to_edit_post.to_dict()



# Delete likes/dislikes to posts
@post_like_routes.route("/posts/<int:post_id>", methods=["DELETE"])
@login_required
def likes_delete_to_post(post_id):
    user_id = int(current_user.get_id())
    like_to_delete_post = PostLike.query.filter((PostLike.post_id == int(post_id)), (PostLike.user_id == user_id)).first()

    if user_id == None:
        return {"errors": "You must be logged in before liking/disliking a comment"}, 401

    if like_to_delete_post == None:
        return {"errors": "This post is not liked or disliked by user"}, 403

    db.session.delete(like_to_delete_post)
    db.session.commit()

    return {"message": "Like/dislike successfully deleted"}
