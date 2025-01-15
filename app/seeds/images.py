from app.models import db, Image, environment, SCHEMA
from sqlalchemy.sql import text

from .image_seed_data import image_seed_data

def seed_images():   
    for x in image_seed_data:
        new_image = Image(
            post_id=x["post_id"],
            image_url=x["image_url"]
        )
        db.session.add(new_image)

    db.session.commit()

def undo_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM images;"))
    db.session.commit()
