# Readdit Clone Project

Render Link: https://irelius-readdit-project.onrender.com/

GitHub Link: https://github.com/irelius/RedditClone

___
## Technologies/Languages Used:
- JavaScript
- Python
- React / Redux
- Flask
- SQLAlchemy
- AWS
<br>
Future technologies that may be utilized are Text Editors (e.g. Lexical) to allow users to customize text in comments.
<br>
<br>


___
## Setup Directions:
1. Clone from GitHub repository
   1. Run `pipenv install` in the `RedditClone` directory
   2. Switch to the `react-app` directory and run `npm install`
   3. Run `pipenv shell` to start the virtual environment
2. Run the following commands to create start a local session
   1. In the `RedditClone` directory, run `flask run`
   2. In the `react-app` directory, run `npm start`

___

## Description:
This is a repository of a Readdit clone by Kihong (Samuel) Bae.
<br>
This project implements 2 full CRUD features: Subreaddits and Posts and 2 partial CRUD features: Likes and Comments.
<br>
This clone project also implements additional features such as:
1. Allow users to create a new account, or sign in with a Demo User account, as well as logging out
2. Search function to look up posts, communities, or users with a keyword
3. See all the posts and comments made by a particular user by visiting their profile page

___

## Landing/Main Page:
Whether or not the user is logged in, accessing the website will direct the user to the Landing Page (the following image uses a Landing Page assuming the user is logged in):
<br>
![Readdit Landing Page](https://raw.githubusercontent.com/irelius/RedditClone/main/assets/Reddit_Landing_Page.png)
If the user is not logged in, there will be an option to "Log In" or "Sign Up" in the right section of the Nav Bar.
<br>
![Readdit Login Form](https://raw.githubusercontent.com/irelius/RedditClone/main/assets/Reddit_Login_Form.png)
![Readdit Signup Form](https://raw.githubusercontent.com/irelius/RedditClone/main/assets/Reddit_Signup_Form.png)
<br>
After logging in, the user will be redirected back to the Landing Page, which also functions as the Main Page where users will be able to see all of the posts made to this cloned website. Users will also be able to see a list of Subreaddits on the right hand side.

___

## Subreaddits:

### Create a Subreaddit
Users are able to create a new Subreaddit with a custom name and an optional description. Names are unique and thus two Subreaddits of the same name cannot be created. However, Subreaddit names are not case sensitive.
<br>
![Readdit Create Subreaddit Form](https://raw.githubusercontent.com/irelius/RedditClone/main/assets/Reddit_Create_Subreddit_Form.png)
<br>
<br>

### Read Subreaddits:
Redux will load the list of Subreaddits in the "Readdit Communities" bar on the right hand side of the Landing/Main page. From there, users are able to click on a specific Subreaddit to go to its main page.
<br>
![Readdit Read Subreaddit Page](https://raw.githubusercontent.com/irelius/RedditClone/main/assets/Reddit_Specific_Subreddit_Page.png)
<br>
<br>

### Updating Subreaddits:
If the user is the admin of a Subreaddit, there will be an option to edit the Subreaddit's description. Currently, this is the only feature of Subreaddits that can be updated. In the future, the plan is to allow users to update more features of a Subreaddit like Subreaddit color scheme, icon image, members, privacy settings, etc.
<br>
![Readdit Edit Subreaddit Page](https://raw.githubusercontent.com/irelius/RedditClone/main/assets/Reddit_Subreddit_Edit_Form.png)
<br>
<br>

### Deleting Subreaddit:
If the user is the admin of a Subreaddit, there will be an option in the Subreaddit Bar named `Delete Subreaddit`. This will delete the Subreaddit for everyone and will also subsequently delete all posts made to the Subreaddit. Currently, only the user that created the Subreaddit will have authorization to delete a Subreaddit.
<br>
![Readdit Delete Subreaddit Page](https://raw.githubusercontent.com/irelius/RedditClone/main/assets/Reddit_Subreddit_Specific_Bar.png)
<br>
<br>

___

## Posts:

### Create Posts:
Users are able to create Posts to Subreaddits. Other users and even individuals who are not logged in will be able to see the Post. In the future, if/when the privacy setting is implemented to Subreaddits, this will change so that only users part of a Subreaddit will be able to see Posts made to it.
<br>
![Readdit Create Post Form](https://raw.githubusercontent.com/irelius/RedditClone/main/assets/Reddit_Create_Post_Form.png)
<br>
<br>

### Read Posts:
Posts will load via Redux on the Landing/Main Page or a Subreaddit's main page, either loading all of the posts made or only the posts made to a particular Subreaddit respectively.
<br>
<br>

### Edit Posts:
Users are able to update their post's body. They are unable to update a post's title, this is not a function that will be implemented as it is not a function Readdit allows for.
<br>
![Readdit Edit Post Form](https://raw.githubusercontent.com/irelius/RedditClone/main/assets/Reddit_Post_Edit_Form.png)
<br>
<br>

### Delete Posts:
Users are able to delete their posts. As posts can only be made to Subreaddit pages, the admins of a particular Subreaddit will also have permission to `Remove` a post, which also functions the same as deletion.

<br>
<br>

___


## Comments:

### Create Comments:
Users will be able to create Comments to Posts when they are logged in. If the user is not logged in, the form to create a comment will not be displayed. For future updates, I will allow users to see the form, but when trying to submit a comment, it will redirect to a sign up/in modal form.
<br>
<br>

### Read Comments:
Comments will load via Redux on each Posts's page. Comments will also be added on the comments section when a new comment is made without the need to refresh the page.
Other users and even individuals who are not logged in will be able to see the Comments made.
<br>
<br>


### Delete Comments:
Users are able to delete their Comments. If the user is the "admin" of a particular Subreaddit, the user will be able to remove Comments made to any Posts that belong to a particular Subreaddit.

<br>
<br>

___

## Likes/Dislikes:
Users are able to create likes or dislikes on Posts and Comments. The functionality is done through a combination of React/Redux and CSS. Users are able to both like and dislike any particular Post or Comment, being able to change the value of likes by two. For example, liking a Post/Comment will change the value from 0 to 1. Then if the user were to dislike that previously liked Post/Comment, the total value will go from 1 to -1 (decreasing by 2).


<br>
<br>

___

## Future Features:
Future features to add would be the following:
2. Allow users to sort through Posts through other options, such as Most Recent, Most Popular, etc.
3. Allow users to edit previously made Comments, making it a full CRUD feature.
4. Implement a text editor to allow for more styling of comments.
<br>
