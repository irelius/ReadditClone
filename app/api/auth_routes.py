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
        return current_user.to_dict()
    return {'errors': {'message': 'Unauthorized'}}, 401


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
def logout():
    logout_user()
    return {'message': 'User logged out'}


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
    return {"errors": ["Unauthorized access"]}, 401


# Delete user
@auth_routes.route("/current", methods = ["DELETE"])
@login_required
def users_delete():
    user = User.query.get(current_user.get_id())
    if user == None:
        return {'errors': [f"User {user} does not exist"]}, 404

    db.session.delete(user)
    db.session.commit()
    return {"message": f"Successfully deleted User {current_user.id}'s account"}