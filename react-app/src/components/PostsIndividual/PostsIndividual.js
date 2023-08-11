import "./PostsIndividual.css"

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom"

import PostBody from "../PostsIndividual/PostComponents/PostBody/PostBody"
import PostSubreadditBar from "./PostComponents/PostSubreadditBar/PostSubreadditBar";
import PostComments from "./PostComponents/PostComments/PostComments";
import PostCreateComment from "./PostComponents/PostCreateComment/PostCreateComment";

import * as subredditActions from "../../store/subreddit"
import * as postActions from "../../store/post"
import * as userActions from "../../store/session"
import * as postLikeActions from "../../store/postLike"
import * as commentActions from "../../store/comment"
import * as commentLikeActions from "../../store/commentLike"


const PostsIndividual = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    const [load, setLoad] = useState(false)
    // const [allCommentLikeStatus, setAllCommentLikeStatus] = useState({})

    const { subreddit_name, post_id } = useParams();

    useEffect(() => {
        dispatch(userActions.loadAllUserThunk())
        dispatch(subredditActions.loadCurrentSubredditThunk(subreddit_name))
        dispatch(postActions.loadPostThunk(post_id))
        dispatch(commentActions.loadPostCommentsThunk(post_id))
        dispatch(postLikeActions.loadLikesPostThunk(post_id))
        if (currentUser.id) {
            dispatch(commentLikeActions.loadUserCommentLikesThunk())
        } else {
            dispatch(commentLikeActions.loadAllCommentLikesThunk())
        }
        setLoad(true)

        return (() => {
            dispatch(subredditActions.clearSubreddit())
            dispatch(postActions.clearPost())
            dispatch(commentActions.clearComment())
            dispatch(postLikeActions.clearPostLikes())
            dispatch(commentLikeActions.clearCommentLikes())
        })
    }, [dispatch])


    const currentPost = Object.values(useSelector(postActions.loadAllPosts))
    const currentPostLikes = Object.values(useSelector(postLikeActions.loadPostLikes))
    const currentSubreddit = Object.values(useSelector(subredditActions.loadAllSubreddit))
    const allUsers = Object.values(useSelector(state => state.session))
    const currentComments = Object.values(useSelector(commentActions.loadAllComments))
    const currentUser = allUsers[0] || -1
    let currentCommentLikes = Object.values(useSelector(commentLikeActions.loadCommentLikes))


    // if (currentCommentLikes.length === 0) {
    //     currentCommentLikes = [{
    //         0: {}
    //     }]
    // }

    return load && allUsers.length > 0 && currentPost.length > 0 && currentPostLikes.length > 0 && currentSubreddit.length > 0 && currentCommentLikes.length > 0 ? (
        <div id="post-main-container">
            <section id="post-close-button-container">
                <button onClick={() => history.goBack()} id="post-close-button">
                    <i className="fa-solid fa-xmark fa-lg" />
                    Close
                </button>
            </section>
            <section id="post-main-body-container">
                <aside id="post-left-section">
                    <section id="post-body-container">
                        <PostBody
                            currentPostLikes={currentPostLikes}
                            currentPost={currentPost}
                            currentSubreddit={currentSubreddit}
                            allUsers={allUsers}
                            currentUser={currentUser}
                            load={load}
                        />
                    </section>
                    <section id="post-create-comment-container">
                        <PostCreateComment
                            currentPost={currentPost}
                            currentSubreddit={currentSubreddit}
                            allUsers={allUsers}
                            currentUser={currentUser}
                            load={load}
                        />
                    </section>
                    <section id="post-comments-container">
                        <PostComments
                            currentPost={currentPost}
                            currentSubreddit={currentSubreddit}
                            allUsers={allUsers}
                            currentUser={currentUser}
                            post_id={post_id}
                            currentLikes={currentCommentLikes}
                            currentComments={currentComments}
                            load={load}
                        />
                    </section>
                </aside>
                <aside id="post-right-section">
                    <section id="post-subreaddit-bar-container">
                        <PostSubreadditBar currentSubreddit={currentSubreddit} />
                    </section>
                </aside>
            </section>
        </div>
    ) : (
        <div></div>
    );

    // return currentCommentLikes.length > 0 ? (
    //     <div id="post-main-container">
    //         <section id="post-close-button-container">
    //             <button onClick={() => history.goBack()} id="post-close-button">
    //                 <i className="fa-solid fa-xmark fa-lg" />
    //                 Close
    //             </button>
    //         </section>
    //         <section id="post-main-body-container">
    //             <aside id="post-left-section">
    //                 <section id="post-body-container">
    //                     {PostBody({ currentPostLikes, currentPost, currentSubreddit, allUsers, currentUser, load })}
    //                 </section>
    //                 <section id="post-create-comment-container">
    //                     {PostCreateComment({ currentPost, currentSubreddit, allUsers, currentUser, load })}
    //                 </section>
    //                 <section id="post-comments-container">
    //                     {PostComments({ currentPost, currentSubreddit, allUsers, currentUser, post_id, load })}
    //                 </section>
    //             </aside>
    //             <aside id="post-right-section">
    //                 <section id="post-subreaddit-bar-container">
    //                     {PostSubreadditBar({ currentSubreddit })}
    //                 </section>
    //             </aside>
    //         </section>
    //     </div>
    // ) :(
    //     <div></div>
    // )
}

export default PostsIndividual;
