import "./PostCreateComment.css"

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom"

import * as commentActions from "../../../../store/comment"

import redirectToUserPage from "../../../HelperFunctions/redirectToUserPage";


const PostCreateComment = ({ currentPost, currentSubreddit, allUsers, currentUser, post_id, load }) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [errors, setErrors] = useState([])
    const [commentBody, setCommentBody] = useState("")

    useEffect(() => {
        dispatch(commentActions.loadPostCommentsThunk(post_id))
    }, [dispatch])

    // ----------------------------------------- Functions ---------------------------------------------- //
    // Comment Creation
    const createComment = async (e) => {
        e.preventDefault()
        let postId = Object.values(currentPost[0])[0].id || null

        let currentSubredditId = Object.keys(currentSubreddit[0])[0] || null
        let currentCommentId = null

        let commentInfo = {
            body: commentBody,
            subreddit_id: currentSubredditId,
            reply_to_id: currentCommentId,
            post_id: postId,
        }

        const data = await dispatch(commentActions.createCommentThunk(commentInfo, postId))

        if (data) {
            setErrors(data)
        }

        if (data === null) {
            dispatch(commentActions.loadPostCommentsThunk(postId))
        }

        setCommentBody("")
    }
    // -------------------------------------------------------------------------------------------------- //


    // ----------------------------------------- Components ---------------------------------------------- //
    const CreateCommentComponent = () => {
        return (
            <div id="create-comment-main-container">
                <section id="create-comment-commenter-container">
                    <aside>
                        Comment as
                    </aside>
                    <aside id="create-comment-commenter-name" onClick={(e) => redirectToUserPage(currentUser.username, history, e)}>
                        {currentUser["username"]}
                    </aside>
                </section>
                <section id="create-comment-form-container">
                    <form onSubmit={createComment} id="create-comment-form">
                        <section id="create-comment-form-body-container">
                            <textarea id="create-comment-form-body"
                                type="text"
                                placeholder="What are your thoughts?"
                                minLength={1}
                                value={commentBody}
                                onChange={(e) => {
                                    setCommentBody(e.target.value)
                                    setErrors([])
                                }}
                            />
                        </section>
                        <section id="create-comment-form-button-container">
                            {/* <aside id="create-comment-error-container">
                                {errors.map((error, ind) => (
                                    <div key={ind}>{error}</div>
                                ))}
                            </aside> */}
                            <aside>
                                <button id="create-comment-submit-button" type="submit">
                                    Comment
                                </button>
                            </aside>
                        </section>
                    </form>
                </section>
            </div>
        )
    }
    // -------------------------------------------------------------------------------------------------- //


    return currentPost.length > 0 && currentSubreddit.length > 0 && allUsers.length > 0 && currentUser !== -1 && load ? (
        <div>
            {CreateCommentComponent()}
        </div>
    ) : (
        <div></div>
    )
}

export default PostCreateComment
