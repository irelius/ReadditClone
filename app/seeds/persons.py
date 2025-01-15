from app.models import db, Person, environment, SCHEMA
from sqlalchemy.sql import text

def seed_persons():   
    # for x in range(1, 12):
    #     new_person = Person(
    #         first_name=f"person name {x}"
    #     )
    #     db.session.add(new_person)    
    
    person_1 = Person(
        first_name="first_name_1"
    )
    person_2 = Person(
        first_name="first_name_2",
        replies_id=1
    )
    person_3 = Person(
        first_name="first_name_3",
        replies_id=1
    )
    person_4 = Person(
        first_name="first_name_4",
        replies_id=2
    )
    person_5 = Person(
        first_name="first_name_5",
        replies_id=2
    )
    person_6 = Person(
        first_name="first_name_6",
        replies_id=2
    )
    person_7 = Person(
        first_name="first_name_7",
        replies_id=3
    )
    person_8 = Person(
        first_name="first_name_8",
        replies_id=7
    )
    person_9 = Person(
        first_name="first_name_9",
        replies_id=7
    )
    person_10 = Person(
        first_name="first_name_10",
        replies_id=9
    )
    person_11 = Person(
        first_name="first_name_11",
        replies_id=9
    )
    person_12 = Person(
        first_name="first_name_12",
        replies_id=9
    )
    
    db.session.add(person_1)
    db.session.add(person_2)
    db.session.add(person_3)
    db.session.add(person_4)
    db.session.add(person_5)
    db.session.add(person_6)
    db.session.add(person_7)
    db.session.add(person_8)
    db.session.add(person_9)
    db.session.add(person_10)
    db.session.add(person_11)
    db.session.add(person_12)
    
    
    
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the persons table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_persons():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.persons RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM persons"))
        
    db.session.commit()
