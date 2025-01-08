from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='demo',
        email='demo@user.io',
        password='password'
    )
    marnie = User(
        username='marnie',
        email='marnie@user.io',
        password='password'
    )
    bobbie = User(
        username='bobbie',
        email='bobbie@user.io',
        password='password'
    )
    yusuke = User(
        username="yusuke",
        email="yusuke@user.io",
        password="password"
    )
    kazu = User(
        username="kazu",
        email="kazu@user.io",
        password="password"
    )
    oelgrin = User(
        username="oelgrin",
        email="oelgrin@user.io",
        password="password"
    )
    aelvif = User(
        username="aelvif",
        email="aelvif@user.io",
        password="password"
    )

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)
    db.session.add(yusuke)
    db.session.add(kazu)
    db.session.add(oelgrin)
    db.session.add(aelvif)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users;"))
        
    db.session.commit()
