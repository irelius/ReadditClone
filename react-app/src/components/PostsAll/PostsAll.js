import "./PostsAll.css"

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom"
import { Modal } from "../../context/Modal";
import { Link, NavLink } from "react-router-dom/cjs/react-router-dom.min";

import * as postActions from "../../store/post"
import * as subredditActions from "../../store/subreddit"
import * as sessionActions from "../../store/session"
import * as postLikeActions from "../../store/postLike"

import redirectToPostPage from "../HelperFunctions/redirectToPostPage";
import redirectToSubredditPage from "../HelperFunctions/redirectToSubredditPage";
import redirectToUserPage from "../HelperFunctions/redirectToUserPage";
import LogInOrSignUpModal from "../Modals/LogInOrSignUpModal/LogInOrSignUpModal";

import calculatePostLikes from "../HelperFunctions/calculatePostLikes";
import modifyPostLikeTotal from "../HelperFunctions/modifyPostLikeTotal";


const PostsAll = () => {
    const history = useHistory();
    const dispatch = useDispatch();


    const [load, setLoad] = useState(false)
    const [initialPostLikeStatus, setInitialPostLikeStatus] = useState(false)
    const [initialPostLikes, setInitialPostLikes] = useState({})
    const [modifiedPostLikes, setModifiedPostLikes] = useState({})

    const [askUserToLogin, setAskUserToLogin] = useState(false)

    useEffect(() => {
        dispatch(sessionActions.loadAllUserThunk())
        dispatch(subredditActions.loadSubredditsThunk())
        dispatch(postActions.loadPostsThunk())
        dispatch(postLikeActions.loadUserPostLikesThunk())

        setLoad(true)

        return (() => {
            dispatch(subredditActions.clearSubreddit())
            dispatch(postActions.clearPost())
            dispatch(postLikeActions.clearPostLikes())
        })
    }, [dispatch])

    const allPosts = Object.values(useSelector(postActions.loadAllPosts))
    const allSubreddits = Object.values(useSelector(subredditActions.loadAllSubreddit))
    const allUsers = Object.values(useSelector(sessionActions.loadAllUsers))
    const currentUserLikes = Object.values(useSelector(postLikeActions.loadPostLikes))


    // Like/Dislike Handling
    const initialTempPostsLiked = async () => {
        setInitialPostLikeStatus(true)

        let updateValue = {}

        let allUserLikes;
        let allUserDislikes;


        if (currentUserLikes.length > 0) {
            allUserLikes = Object.values(currentUserLikes[0]["likes"])
            allUserDislikes = Object.values(currentUserLikes[0]["dislikes"])
            allUserLikes.forEach(el => {
                if (el["post_id"]) {
                    updateValue[el["post_id"]] = el["like_status"]
                }
            })

            allUserDislikes.forEach(el => {
                if (el["post_id"]) {
                    updateValue[el["post_id"]] = el["like_status"]
                }
            })

            setInitialPostLikes((initialPostLikes) => ({ ...initialPostLikes, ...updateValue }))
        } else {
            allUserDislikes = null;
            allUserLikes = null;
        }

    }

    const likeHandler = (post, postLikeStatus) => {
        let likeInfo = {
            like_status: "like"
        }

        let updateValue = {}

        if (postLikeStatus === "like") {
            dispatch(postLikeActions.deleteLikePostThunk(post["id"]))
            updateValue[post["id"]] = "neutral"
        } else if (postLikeStatus === "neutral") {
            dispatch(postLikeActions.createLikePostThunk(likeInfo, post["id"]))
            updateValue[post["id"]] = "like"
        } else {
            dispatch(postLikeActions.deleteLikePostThunk(post["id"]))
            dispatch(postLikeActions.createLikePostThunk(likeInfo, post["id"]))
            updateValue[post["id"]] = "like"
        }

        setModifiedPostLikes(modifiedPostLikes => ({
            ...modifiedPostLikes,
            ...updateValue
        }))

    }

    const dislikeHandler = (post, postLikeStatus, e) => {
        let likeInfo = {
            like_status: "dislike"
        }

        let updateValue = {}

        if (postLikeStatus === "dislike") {
            dispatch(postLikeActions.deleteLikePostThunk(post["id"]))
            updateValue[post["id"]] = "neutral"
        } else if (postLikeStatus === "neutral") {
            dispatch(postLikeActions.createLikePostThunk(likeInfo, post["id"]))
            updateValue[post["id"]] = "dislike"
        } else {
            dispatch(postLikeActions.deleteLikePostThunk(post["id"]))
            dispatch(postLikeActions.createLikePostThunk(likeInfo, post["id"]))
            updateValue[post["id"]] = "dislike"
        }

        setModifiedPostLikes(modifiedPostLikes => ({
            ...modifiedPostLikes,
            ...updateValue
        }))
    }
    //


    // Main Component
    const LoadAllPosts = () => {
        const postsToLoad = Object.values(allPosts[0])
        const usersToLoad = allUsers[1]
        const subredditsToLoad = allSubreddits[0]
        const currentUser = allUsers[0] || -1

        const postLikesToLoad = {}

        if (!initialPostLikeStatus) {
            initialTempPostsLiked()
        }


        return (
            Array.isArray(postsToLoad) && postsToLoad.map((el, i) => {
                const subredditId = el["subreddit_id"]
                const subredditInfo = subredditsToLoad[subredditId]
                const postTitle = el["title"]
                const postBody = el["body"]
                const postSubreddit = subredditsToLoad[el["subreddit_id"]]
                const postPoster = usersToLoad[el["user_id"]]
                const postImage = Object.values(el["images"])

                // figure out like status of each post on the front page
                let postLikeStatus = "neutral"
                let postLikes = Object.values(el["post_likes"])

                postLikes.forEach(el => {
                    if (el["user_id"] === currentUser["id"] && el["like_status"] === "like") {
                        postLikeStatus = "like"
                        postLikesToLoad[el["id"]] = "like"
                    }
                    if (el["user_id"] === currentUser["id"] && el["like_status"] === "dislike") {
                        postLikeStatus = "dislike"
                        postLikesToLoad[el["id"]] = "dislike"
                    }
                })


                if (modifiedPostLikes[el["id"]]) {
                    postLikeStatus = modifiedPostLikes[el["id"]]
                }

                return (
                    <div key={i} id="all-posts-main-container" onClick={(e) => redirectToPostPage(subredditInfo["name"], el["id"], history, e)}>
                    {/* <div key={i} id="all-posts-main-container"> */}
                        <aside id="all-posts-left-section">
                            <aside id="post-upvote-button" onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                if (currentUser === -1) {
                                    setAskUserToLogin(true)
                                } else {
                                    likeHandler(el, postLikeStatus, e)
                                }
                            }}>
                                <i className="fa-solid fa-up-long fa-lg" id={`post-like-status-${postLikeStatus}`} />
                            </aside>
                            <aside id="post-vote-counter">{calculatePostLikes(el) + modifyPostLikeTotal(el, initialPostLikes, modifiedPostLikes)}</aside>
                            {/* <aside id="post-vote-counter">{modifyPostLikeTotal(el)}</aside> */}
                            <aside id="post-downvote-button" onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                if (currentUser === -1) {
                                    setAskUserToLogin(true)
                                } else {
                                    dislikeHandler(el, postLikeStatus, e)
                                }
                            }}>
                                <i className="fa-solid fa-down-long fa-lg" id={`post-dislike-status-${postLikeStatus}`} />
                            </aside>
                        </aside >
                        {/* <Link exact to={`/r/${postSubreddit["name"]}`}>Test Test</Link> */}
                        <aside id="all-posts-right-section">
                            <aside id="individual-post-main-container">
                                <section id="individual-post-header-container">
                                    <aside id="individual-post-header-subreddit-information">
                                        <section id="post-header-subreddit-information" onClick={(e) => redirectToSubredditPage(postSubreddit["name"], history, e)}>
                                            r/{postSubreddit["name"]}
                                        </section>
                                    </aside>
                                    <aside id="individual-post-header-poster-information">
                                        Posted by
                                        <section id="individual-post-header-poster" onClick={(e) => redirectToUserPage(postPoster["username"], history, e)}>
                                            u/{postPoster["username"]}
                                        </section>
                                    </aside>
                                    {/* <aside id="post-header-join -container">
                                     </aside> */}
                                </section>
                                <section id="individual-post-body-container">
                                    <section id="individual-post-title">
                                        {postTitle}
                                    </section>
                                    <section id="individual-post-body">
                                        {postBody}
                                    </section>
                                    {postImage.length > 0 ? (
                                        <section id="individual-post-image">
                                            <img src={`${postImage[0]["image_url"]}`}
                                                width={400}
                                                alt="individual-post-on-main-page"
                                            ></img>
                                        </section>
                                    ) : (
                                        <div className="nothing"></div>
                                    )}
                                </section>
                                <section id="individual-post-footer-container">
                                    <aside id="individual-post-footer-comments-container">
                                        <aside>
                                            <i id="individual-post-footer-comments-icon" className="fa-regular fa-message fa-lg" />
                                        </aside>
                                        <aside id="individual-post-footer-comments">
                                            Comments
                                        </aside>
                                    </aside>
                                    {/* <aside id="individual-post-footer-dots-container">
                                        <i id="individual-post-footer-dots-icon" className="fa-solid fa-ellipsis" />
                                    </aside> */}
                                </section>
                            </aside>
                        </aside>
                    </div >
                )
            })
        )
    }

    return allPosts.length > 0 && allUsers.length > 1 && allSubreddits.length > 0 && load ? (
        <div>
            {askUserToLogin && (
                <Modal>
                    {LogInOrSignUpModal({ setAskUserToLogin })}
                </Modal>
            )}
            {LoadAllPosts()}
        </div>
    ) : (
        <div>
        </div>
    )

}

export default PostsAll;
