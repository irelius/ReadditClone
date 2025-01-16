from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, ValidationError

def check_comment_length(form, field):
    body = form.data["body"].strip()

    if len(body) == 0:
        raise ValidationError("A comment body is required")
    
class CommentForm(FlaskForm):
    body = StringField('body', validators=[DataRequired(), check_comment_length])
    subreddit_id = IntegerField("subreddit_id", validators=[DataRequired()])
    post_id = IntegerField("post_id", validators=[DataRequired()])
    replies_id = IntegerField("replies_id")