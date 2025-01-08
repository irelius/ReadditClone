from app.models import db, Post, environment, SCHEMA
from sqlalchemy.sql import text

def seed_posts():
    post_one = Post(
        title = "Freshly baked bread",
        user_id = 1,
        subreddit_id = 1,
        body = "My girlfriend just used my grandma's old bread recipe and oh man, that smell was just 100% nostalgia."
    )
    post_two = Post(
        title = "Silent passage",
        user_id = 2,
        subreddit_id = 2,
        body = "Captured the moon's descent over this desolate bridge, wrapped in an eerie calm. The world seems suspended in time, and the melancholic whispers of the night echo through the solitude."
    )
    post_three = Post(
        title = "LED Eyebrows. Really?",
        user_id = 3,
        subreddit_id = 3,
        body = "Ran into this futuristic makeup trend: LED eyebrows. Perfect for those nights when you want your expressions to be as bright as your ideas."
    )
    post_four = Post(
        title = "Monochrome Japan",
        user_id = 4,
        subreddit_id = 2,
        body = "Winter's grip, the fog, and the grayscale scenery somehow made this bustling place feel empty, as if I was the only one witnessing it. Mount Fuji and the silent cityscape got me in my feels."
    )
    post_five = Post(
        title = "Autumn's Embrace",
        user_id = 5,
        subreddit_id = 1,
        body = "Stood amidst the captivating beauty of a fall forest, its golden hues embracing me. The leaves whispered tales of fleeting moments."
    )
    post_six = Post(
        title = "Literature Recommendations",
        user_id = 6,
        subreddit_id = 2,
        body = "Looking for book recommendations that capture the essence of melancholy. Any hidden gems that made you feel a spectrum of emotions? Let's compile a list together."
    )
    post_seven = Post(
        title = "Jetpack jackets because walking is too mainstream",
        user_id = 7,
        subreddit_id = 3,
        body = "Spotted this gem today: a jetpack jacket claiming to revolutionize the commute game. Who needs sidewalks, right? What's next, rocket-powered high heels?"
    )
    post_eight = Post(
        title = "remember being a kid at the playground?",
        user_id = 1,
        subreddit_id = 1,
        body = "Heard the distant laughter of children playing hide and seek. Reminded me of the ephemeral nature of innocence and the joy of fleeting childhood games. What childhood echoes do you catch in passing?"
    )
    post_nine = Post(
        title = "Déjà Vu Lottery Numbers",
        user_id = 3,
        subreddit_id = 4,
        body = "Dreamt of winning the lottery with a set of numbers I'd never seen before. Checked the winning numbers the next day – they matched. Is my subconscious a time traveler, or did I just get lucky in two timelines?"
    )
    post_ten = Post(
        title = "Faded Photo. Fresh Memories",
        user_id = 4,
        subreddit_id = 4,
        body = "Found an old family photo, but I distinctly remember an extra person in the picture who wasn't there before. Alternate timeline family reunion, or did Photoshop sneak into the '90s?"
    )


    db.session.add(post_one)
    db.session.add(post_two)
    db.session.add(post_three)
    db.session.add(post_four)
    db.session.add(post_five)
    db.session.add(post_six)
    db.session.add(post_seven)
    db.session.add(post_eight)
    db.session.add(post_nine)
    db.session.add(post_ten)

    db.session.commit()


def undo_posts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.posts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM posts;"))

    db.session.commit()
