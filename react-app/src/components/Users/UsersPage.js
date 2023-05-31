import "./UsersPage.css"

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import * as sessionActions from "../../store/session"
import * as subredditActions from "../../store/subreddit"
import * as postActions from "../../store/post"
import * as commentActions from "../../store/comment"

import ErrorPage from "../ErrorPage";
import UsersPageComments from "./UsersPageComponents/UsersPageComments/UsersPageComments";
import UsersPagePosts from "./UsersPageComponents/UsersPagePosts/UsersPagePosts";

// test
import redirectToPostPage from "../HelperFunctions/redirectToPostPage"
import redirectToSubredditPage from "../HelperFunctions/redirectToSubredditPage"
import redirectToUserPage from "../HelperFunctions/redirectToUserPage"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";


const UsersPage = () => {
    const dispatch = useDispatch()
    const username = useParams().username;
    const [load, setLoad] = useState(false)
    const [tabSelected, setTabSelected] = useState("posts")
    const [test, setTest] = useState('')

    const history = useHistory()

    useEffect(() => {
        dispatch(sessionActions.loadAllUserThunk())
        dispatch(commentActions.loadUserCommentsThunk(username))
        dispatch(postActions.loadPostsThunk())
        dispatch(subredditActions.loadSubredditsThunk())
        setLoad(true)

        return (() => {
            dispatch(commentActions.clearComment())
            dispatch(postActions.clearPost())
            dispatch(subredditActions.clearSubreddit())
        })
    }, [dispatch, test])


    const allUsers = Object.values(useSelector(sessionActions.loadAllUsers))
    // const currentUserId = allUsers[0]["id"] || -1
    const allPosts = Object.values(useSelector(postActions.loadAllPosts))
    const allSubreddits = Object.values(useSelector(subredditActions.loadAllSubreddit))
    const currentUserComments = Object.values(useSelector(commentActions.loadAllComments))

    const LoadBody = () => {
        let props = {
            "allSubreddits": allSubreddits,
            "allPosts": allPosts,
            "currentUserComments": currentUserComments,
            "allUsers": allUsers
        }
        if (tabSelected === "posts") {
            const profileUserId = Object.values(allUsers[1]).filter(el => {
                if (el["username"] === username) {
                    return el['id']
                }
            })[0]["id"]

            props["allPosts"] = {
                0: Object.values(allPosts[0]).filter(el => {
                    if (el["user_id"] === profileUserId) {
                        return el
                    }
                })
            }

            return (
                <div>
                    <UsersPagePosts props={props} />
                </div>
            )
        } else if (tabSelected === "comments") {

            // const username = useParams().username;

            const comments = props["currentUserComments"][0]
            const commentsArray = Object.values(comments)
            const posts = props["allPosts"][0]
            const subreddits = props["allSubreddits"][0]
            const allUsers = props["allUsers"][1]


            return (
                Array.isArray(commentsArray) && commentsArray.map((el, i) => {
                    const belongToSubredditId = el["subreddit_id"]
                    const postSubreddit = subreddits[belongToSubredditId]
                    const belongToPostId = el["post_id"]
                    const post = posts[belongToPostId]
                    const postPoster = allUsers[post['user_id']]

                    return (
                        <div key={i} id="user-comments-main-container" onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            redirectToPostPage(postSubreddit["name"], belongToPostId, history, e)
                        }}>
                            <section id="user-comments-header-container">
                                <aside id="user-comments-header-icon">
                                    <i className="fa-regular fa-message fa-xl" />
                                </aside>
                                <aside id="user-comments-header-description">
                                    <section id="user-comments-header-username" onClick={(e) => {
                                        e.stopPropagation()
                                        e.preventDefault()
                                        redirectToUserPage(username, history, e)
                                    }}>
                                        {username}
                                    </section>
                                    commented on
                                    <section id="user-comments-header-post" onClick={(e) => {
                                        e.stopPropagation()
                                        e.preventDefault()
                                        redirectToPostPage(postSubreddit["name"], belongToPostId, history, e)
                                    }}>
                                        {post["title"]}
                                    </section>
                                </aside>
                                <aside id="user-comments-header-subreddit" onClick={(e) => {
                                    e.stopPropagation()
                                    e.preventDefault()
                                    redirectToSubredditPage(postSubreddit["name"], history, e)
                                }}>
                                    r/{subreddits[belongToSubredditId]["name"]}
                                </aside>
                                Posted by
                                <aside id="user-comments-header-poster" onClick={(e) => {
                                    e.stopPropagation()
                                    e.preventDefault()
                                    redirectToUserPage(postPoster["username"], history, e)
                                }}>
                                    u/{postPoster["username"]}
                                </aside>
                            </section>
                            <section id="user-comments-body-container">
                                <section id="user-comments-body-header-container">
                                    <aside id="user-comments-body-username" onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        history.push(`/users/${username}`)
                                        // console.log("booba")
                                    }}>
                                        {username}
                                    </aside>
                                    <aside id="user-comments-OP">
                                        OP
                                    </aside>
                                </section>
                                <section id="user-comments-body">
                                    {el["body"]}
                                </section>
                            </section>
                            <section id="user-comments-footer-container">

                            </section>
                        </div>
                    )
                })
            )
        }
    }

    return allUsers.length > 0 && allPosts.length > 0 && allSubreddits.length > 0 && load ? (
        <div id="user-page-main-container">
            <section id="user-page-tabs-container">
                <aside id="user-page-posts-tab-container">
                    <section id="user-page-posts-tab" className={`posts-selected-${tabSelected}`} onClick={() => setTabSelected("posts")}>
                        POSTS
                    </section>
                </aside>
                <aside id="user-page-comments-tab-container">
                    <section id="user-page-comments-tab" className={`comments-selected-${tabSelected}`} onClick={() => setTabSelected("comments")}>
                        COMMENTS
                    </section>
                </aside>
            </section >
            <section id="user-page-content-container">
                {LoadBody()}
            </section>
        </div >
    ) : (
        <div id="users-posts-no-user">
            <ErrorPage />
        </div>
    )
}

export default UsersPage;
