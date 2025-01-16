from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField, IntegerField
from wtforms.validators import DataRequired, ValidationError
from app.models import Subreddit

def subreddit_exists(form, field):
    name = field.data.strip()
    name = Subreddit.query.filter(Subreddit.name == name).first()
    if name:
        raise ValidationError("This subreddit name is already in use.")
    
# TODO: Add validator to check that the subreddit is a public subreddit. Implement when privacy feature is implemented

class UserSubredditForm(FlaskForm):
    admin_status = BooleanField("admin_status", validators=[DataRequired()])
    mod_status = BooleanField("mod_status", validators=[DataRequired()])
    # subreddit_id = IntegerField("subreddit_id", validators=[DataRequired(), subreddit_exists])
