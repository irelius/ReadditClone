from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, BooleanField
from wtforms.validators import DataRequired, ValidationError

def check_comment_length(form, field):
    body = form.data["body"].strip()

    if len(body) == 0:
        raise ValidationError("Comment body is required and cannot be empty")

    
class PostCommentForm(FlaskForm):
    body = StringField('body', validators=[DataRequired(message="Comment body is required and cannot be empty"), check_comment_length])
    
    
class ReplyCommentForm(FlaskForm):
    body = StringField('body', validators=[DataRequired(message="Comment body is required and cannot be empty"), check_comment_length])
    
    
class UpdateCommentForm(FlaskForm):
    body = StringField('body', validators=[DataRequired(message="Comment body is required and cannot be empty"), check_comment_length])