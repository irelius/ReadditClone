from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Subreddit, UserSubreddit, User, Post
from app.forms import SubredditForm, UserSubredditForm
from app.helper import validation_error_message, return_subreddit, return_subreddits, return_user_sub,return_user_subs, return_posts
from sqlalchemy.orm import joinedload

subreddit_routes = Blueprint('subreddits', __name__)

# Get all subreddits
@subreddit_routes.route("/")
def subreddits_all():
    subreddits = Subreddit.query.all()
    return return_subreddits(subreddits)


# Get specific subreddit by id
@subreddit_routes.route("/<int:subreddit_id>")
def subreddit_by_id(subreddit_id):
    subreddit = Subreddit.query.get(subreddit_id)    
    return return_subreddit(subreddit)


# Create a new subreddit
@subreddit_routes.route("/", methods=["POST"])
@login_required
def subreddits_create_new():
    user_id = int(current_user.get_id())

    form = SubredditForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_subreddit = Subreddit(
            name = form.data["name"].strip(" ").replace(" ", "_"),
            description = form.data["description"].strip(" "),
        )

        db.session.add(new_subreddit)
        db.session.commit()

        new_subreddit_user = UserSubreddit(
            subreddit_id = new_subreddit.id,
            user_id = user_id,
            admin_status = True,
            mod_status = False
        )

        db.session.add(new_subreddit_user)
        db.session.commit()
        return return_subreddit(new_subreddit)
    
    return {"errors": validation_error_message(form.errors)}, 400

# Update a subreddit description by id, also possibly the privacy setting of subreddit if functionality implemented later
@subreddit_routes.route("/<int:subreddit_id>", methods=["PUT"])
@login_required
def subreddits_update_specific(subreddit_id):
    user_id = int(current_user.get_id())

    admin_check = UserSubreddit.query.filter(UserSubreddit.user_id == user_id, UserSubreddit.subreddit_id == subreddit_id, UserSubreddit.admin_status == True).first()
        
    if admin_check == None:
        return {"errors": ["You do not have permission to edit this subreddit"]}, 403

    subreddit_to_edit = Subreddit.query.get(subreddit_id)
    form = SubredditForm()

    if form.validate_on_submit():
        subreddit_to_edit.description = form.data["description"].strip(" ")
        
        db.session.commit()
        return return_subreddit(subreddit_to_edit)
    
    return {"errors": validation_error_message(form.errors)}, 401 


# Delete a subreddit. Techically, this is not a function that is readily available to users of Readdit, but it is implemented in this project to demonstrate full CRUD functionality
@subreddit_routes.route("/<int:subreddit_id>", methods=["DELETE"])
@login_required
def subreddits_delete_specific(subreddit_id):   
    user_id = int(current_user.get_id())

    subreddit_to_delete = Subreddit.query.get(subreddit_id)
    if subreddit_to_delete == None:
        return {"errors": ["Subreddit does not exist."]}, 404
    
    admin_check = UserSubreddit.query.filter(UserSubreddit.user_id == user_id, UserSubreddit.subreddit_id == subreddit_id, UserSubreddit.admin_status == True).first()
    if admin_check == None:
        return {"errors": ["You do not have permission to delete this subreddit"]}, 403

    db.session.delete(subreddit_to_delete)
    db.session.commit()

    return {
        "id": subreddit_to_delete.id,
        "message": "Successfully deleted subreddit"
    }


# -------------------------------------------------- User stuff --------------------------------------------------
# Get all users of subreddit
@subreddit_routes.route("/<int:subreddit_id>/users")
def subreddit_users(subreddit_id):
    subreddit_check = Subreddit.query.get(subreddit_id)
    if subreddit_check == None:
        return {"errors": ["Subreddit does not exist"]}, 404
    
    user_subs = UserSubreddit.query.options(joinedload(UserSubreddit.user_join)).filter(UserSubreddit.subreddit_id == subreddit_id).join(Subreddit).all()

    return return_user_subs(user_subs, "user")

# Join subreddit as a new member
# TODO: implement function to add users to a private subreddit. Will require refactoring subreddit model
@subreddit_routes.route("<int:subreddit_id>/join", methods=["POST"])
@login_required
def subreddits_join(subreddit_id):
    user_id = int(current_user.get_id())
    
    subreddit = Subreddit.query.get(id)
    if subreddit == None:
        return {"errors": ["Subreddit does not exist to join."]}, 404

    form = UserSubredditForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_user_subreddit = UserSubreddit(
            admin_status = False,
            mod_status = False,
            user_id = user_id,
            subreddit_id = subreddit_id
        )
        
        db.session.add(new_user_subreddit)
        db.session.commit()
        
        return return_user_sub(new_user_subreddit)
    
    return {"errors": validation_error_message(form.errors)}, 401

# Leave subreddit as current user
@subreddit_routes.route('<int:subreddit_id>/leave', methods=["DELETE"])
@login_required
def subreddits_leave(subreddit_id):
    user_id = int(current_user.get_id())
        
    subreddit_check = Subreddit.query.get(subreddit_id)
    if subreddit_check == None:
        return {"errors": ["Subreddit does not exist. User is not part of subreddit"]}, 404

    subreddit_to_leave = UserSubreddit.query.options(joinedload(UserSubreddit.user_join), joinedload(UserSubreddit.subreddit_join)).filter(UserSubreddit.user_id == user_id, UserSubreddit.subreddit_id == subreddit_id).first()
    
    if subreddit_to_leave == None:
        return {"errors": ["User is not part of this subreddit"]}, 404
    
    db.session.delete(subreddit_to_leave)
    db.session.commit()
    
    return {
        "id": subreddit_to_leave.id,
        "message": "User has left subreddit successfully"
    }

# -------------------------------------------------- Post stuff --------------------------------------------------
# Get all posts of subreddit
@subreddit_routes.route("/<int:subreddit_id>/posts")
def subreddit_posts(subreddit_id):
    subreddit_check = Subreddit.query.get(subreddit_id)
    if subreddit_check == None:
        return {"errors": ["Subreddit does not exist"]}, 404
    
    posts = Post.query.options(joinedload(Post.users), joinedload(Post.subreddits), joinedload(Post.post_likes), joinedload(Post.comments), joinedload(Post.images)).filter(Post.subreddit_id == subreddit_id).all()
    return return_posts(posts)