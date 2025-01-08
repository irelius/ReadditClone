from app.models import db, CommentLike, environment, SCHEMA
from sqlalchemy.sql import text

def seed_comment_likes():
    comment_like_one = CommentLike(
        like_status = "dislike",
        user_id = 5,
        comment_id = 11,
    )
    comment_like_two = CommentLike(
        like_status = "dislike",
        user_id = 6,
        comment_id = 11
    )
    comment_like_three = CommentLike (
        like_status = "dislike",
        user_id = 7,
        comment_id = 11
    )
    comment_like_four = CommentLike(
        like_status = "dislike",
        user_id = 1,
        comment_id = 12
    )
    comment_like_five = CommentLike(
        like_status = "dislike",
        user_id = 2,
        comment_id = 12
    )
    comment_like_six = CommentLike(
        like_status = "like",
        user_id = 3,
        comment_id = 12
    )
    comment_like_seven = CommentLike (
        like_status = "like",
        user_id = 4,
        comment_id = 12
    )
    comment_like_eight = CommentLike (
        like_status = "like",
        user_id = 1,
        comment_id = 10
    )
    comment_like_nine = CommentLike (
        like_status = "dislike",
        user_id = 2,
        comment_id = 10
    )

    comment_like_ten = CommentLike (
        like_status = "dislike",
        user_id = 1,
        comment_id = 1
    )
    comment_like_eleven = CommentLike (
        like_status = "like",
        user_id = 1,
        comment_id = 2
    )
    comment_like_twelve = CommentLike (
        like_status = "like",
        user_id = 1,
        comment_id = 3
    )
    comment_like_thirteen = CommentLike (
        like_status = "like",
        user_id = 2,
        comment_id = 1
    )


    db.session.add(comment_like_one)
    db.session.add(comment_like_two)
    db.session.add(comment_like_three)
    db.session.add(comment_like_four)
    db.session.add(comment_like_five)
    db.session.add(comment_like_six)
    db.session.add(comment_like_seven)
    db.session.add(comment_like_eight)
    db.session.add(comment_like_nine)
    db.session.add(comment_like_ten)
    db.session.add(comment_like_eleven)
    db.session.add(comment_like_twelve)
    db.session.add(comment_like_thirteen)


    db.session.commit()


def undo_comment_likes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comment_likes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM comment_likes;"))

    db.session.commit()
