from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, ValidationError

def valid_like_status(form, field):
    like_status = field.data.strip()
    if like_status != "like" and like_status != "dislike":
        raise ValidationError("Request for liking/disliking post has invalid data")

class LikeForm(FlaskForm):
    like_status = StringField("like_status", validators=[valid_like_status])