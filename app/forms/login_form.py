from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    email = field.data.strip()
    user = User.query.filter(User.email == email).first()
    if not user:
        raise ValidationError('Email provided not found.')


def password_matches(form, field):
    # Checking if password matches
    password = field.data.strip()
    email = form.data['email'].strip()
    user = User.query.filter(User.email == email).first()
    if not user:
        raise ValidationError('Invalid credentials.')
    if not user.check_password(password):
        raise ValidationError('Invalid credentials.')


class LoginForm(FlaskForm):
    email = StringField('email', validators=[DataRequired(message="Email is required."), user_exists])
    password = StringField('password', validators=[DataRequired(message="Password is required."), password_matches])