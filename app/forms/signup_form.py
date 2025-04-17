from flask_wtf import FlaskForm
from wtforms import StringField, EmailField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User
import re

# Checking if user exists
def user_exists(form, field):
    email = field.data.strip()
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use')

# Checking if username is already in use
def username_exists(form, field):
    username = field.data.strip()
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use')

# Check that username has valid characters and is of appropriate length
def check_username(form, field):
    username = field.data.strip()
    special_characters = " `~!@#$%^&*()+=[{]}\|;:,.<>/?'\"\""
    
    if any(c in special_characters for c in username):
        raise ValidationError("Letters, numbers, dashes, and underscores only. Please try again without symbols")
    
    if 3 > len(username) or 20 < len(username):
        raise ValidationError("Username must be between 3 and 20 characters")
        

# check that password is at least 8 characters long
def check_password (form, field):
    password = field.data.strip()
    
    if len(password) < 8:
        raise ValidationError("Password length must be at least 8 characters long")


class SignUpForm(FlaskForm):
    username = StringField('username', validators=[DataRequired(message="Username is required"), check_username, username_exists])
    email = EmailField('email', validators=[Email("Invalid email provided"), DataRequired(message="Email is required"), user_exists])
    password = StringField('password', validators=[DataRequired("Password is required"), check_password])