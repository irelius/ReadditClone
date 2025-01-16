from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Subreddit, UserSubreddit, User
from app.forms import SubredditForm
from app.helper import validation_error_message, return_subreddits

subreddit_routes = Blueprint('subreddits', __name__)


# Get all subreddits
@subreddit_routes.route("/")
def subreddits_all():
    subreddits = Subreddit.query.all()
    return return_subreddits(subreddits)


# Get specific subreddit by id
@subreddit_routes.route("/<int:subreddit_id>")
def subreddits_specific_id(subreddit_id):
    subreddit = Subreddit.query.get(subreddit_id)
    if subreddit == None:
        return {"error": "Subreddit does not exist"}
    return subreddit.to_dict()


# Get all users of subreddit
@subreddit_routes.route("/<int:subreddit_id>/users")
def subreddits_specific_users(subreddit_id):
    user_subs = UserSubreddit.query.filter(UserSubreddit.subreddit_id == subreddit_id).join(Subreddit).all()
    if len(user_subs) == 0:
        return {"error": "Subreddit does not have any users"}
    return {user_sub.id: user_sub.user_data_dict() for user_sub in user_subs}


# Create a new subreddit
@subreddit_routes.route("/new", methods=["POST"])
@login_required
def subreddits_create_new():
    current_user_id = int(current_user.get_id())

    if current_user_id == None:
        return {"errors": "You must be logged in before creating a new subreddit"}, 401

    form = SubredditForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    name = form.data["name"].strip(" ").replace(" ", "_")

    if form.validate_on_submit():
        new_subreddit = Subreddit(
            name = name,
            description = form.data["description"],
            admin_id = current_user_id
        )

        db.session.add(new_subreddit)
        db.session.commit()

        new_subreddit_user = UserSubreddit(
            subreddit_id = new_subreddit.id,
            user_id = current_user_id,
        )

        db.session.add(new_subreddit_user)
        db.session.commit()
        return new_subreddit.to_dict()
    return {"errors": validation_error_message(form.errors)}, 400


# TODO: implement function to add users to a private subreddit (another TO DO in the subreddit) or join a subreddit if public (this part is done for now)
# Add a user to a subreddit
# @subreddit_routes.route("/<int:subreddit_id>", methods=["POST"])
# @login_required
# def subreddits_add_user(subreddit_id):
#     current_user_id = int(current_user.get_id())

#     if current_user_id == None:
#         return {"errors": "You must be logged in before addings people to this subreddit"}, 401


#     # This would require a user to be added if the subreddit is set to private
#     # subreddit_users = UserSubreddit.query.filter((UserSubreddit.subreddit_id == subreddit_id), (UserSubreddit.user_id == current_user_id)).all()
#     # if len(subreddit_users) == 0:
#     #     return {"errors": "You do not have permission to add a user to this subreddit"}, 403

#     new_subreddit_user = UserSubreddit(
#         subreddit_id = subreddit_id,
#         user_id = current_user_id
#     )

#     db.session.add(new_subreddit_user)
#     db.session.commit()

#     return {"message": f"Successfully added User {current_user_id} to Subreddit {subreddit_id}."}


# Update a subreddit description by id, also possibly the privacy setting of subreddit if functionality implemented later
@subreddit_routes.route("/<int:subreddit_id>", methods=["PUT"])
@login_required
def subreddits_update_specific(subreddit_id):
    current_user_id = int(current_user.get_id())
    subreddit_to_edit = Subreddit.query.get(subreddit_id)

    if current_user_id == None:
        return {"errors": "You must be logged in before editing this subreddit"}, 401

    if subreddit_to_edit.admin_id != current_user_id:
        return {"errors": "You do not have permission to edit this subreddit"}, 403

    form = SubredditForm()
    subreddit_to_edit.description = form.data["description"]

    db.session.commit()
    return subreddit_to_edit.to_dict()


# Delete a subreddit. Techically, this is not a function that is readily available to users of Readdit, but it is implemented
# in this project to demonstrate full CRUD functionality
@subreddit_routes.route("/<int:subreddit_id>", methods=["DELETE"])
@login_required
def subreddits_delete_specific(subreddit_id):
    current_user_id = int(current_user.get_id())
    subreddit_to_delete = Subreddit.query.get(subreddit_id)

    if current_user_id == None:
        return {"errors": "You must be logged in before deleting this subreddit"}, 401

    if(subreddit_to_delete.admin_id != current_user_id):
        return {"errors": "You do not have permission to delete this subreddit"}, 403

    db.session.delete(subreddit_to_delete)
    db.session.commit()

    return {"message": f"Successfully deleted Subreddit {subreddit_id}."}
