from flask import Blueprint, request
from app.models import User, db
from app.forms import LoginForm
from app.forms import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required
from app.helper import validation_error_message

auth_routes = Blueprint('auth', __name__)


@auth_routes.route('/')
def authenticate():
    if current_user.is_authenticated:
        user = User.query.get(current_user.id)
        return user.to_dict()
    return {'errors': ["Authentication error"]}, 401


@auth_routes.route('/login', methods=['POST'])
def login():
    form = LoginForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        user = User.query.filter(User.email == form.data['email']).first()
        login_user(user)
        return user.to_dict()
    
    return {"errors": validation_error_message(form.errors)}, 401


@auth_routes.route('/logout', methods=["DELETE"])
@login_required
def logout():
    user_id = int(current_user.get_id())
    logout_user()
    return {
        "id": user_id,
        "message": 'User successfully logged out'
    }


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    form = SignUpForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    
    username = form.data["username"].strip().replace(" ", "_")
    
    if form.validate_on_submit():
        user = User(
            username = username,
            email=form.data['email'].strip(),
            password=form.data['password'].strip()
        )
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return user.to_dict()
    return {"errors": validation_error_message(form.errors)}, 401


@auth_routes.route('/unauthorized')
def unauthorized():
    return {"errors": ["Unauthorized access. User must be logged in."]}, 401
