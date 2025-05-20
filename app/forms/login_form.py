from flask_wtf import FlaskForm
from wtforms import StringField, EmailField
from wtforms.validators import DataRequired, ValidationError, Email
from app.models import User
import re

def password_matches(form, field):
    # Checking if password matches
    password = field.data.strip()
    email = form.data['email'].strip()
    
    # return nothing if email is blank (prevents duplicate validation error message)
    if len(email) == 0:
        return
    
    # retur nothing if email is not valid email format (prevents duplicate validation error message)
    EMAIL_REGEX = re.compile(r"[^@]+@[^@]+\.[^@]+")
    if not EMAIL_REGEX.match(email):
        return
        
    # if user is trying to use an email for an account that doesn't exist or if password is incorrect
    user = User.query.filter(User.email == email).first()
    if user == None or not user.check_password(password):
        raise ValidationError('Invalid credentials')

class LoginForm(FlaskForm):
    email = EmailField('email', validators=[DataRequired(message="Email is required"), Email('Invalid email provided')])
    password = StringField('password', validators=[DataRequired(message="Password is required"), password_matches])