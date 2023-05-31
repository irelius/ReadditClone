import "./PostComments.css"

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom"

import * as commentActions from "../../../../store/comment"
import * as commentLikeActions from "../../../../store/commentLike"

import redirectToUserPage from "../../../HelperFunctions/redirectToUserPage";
import modifyCommentLikeTotal from "../../../HelperFunctions/modifyCommentLikeTotal";
import calculateCommentLikes from "../../../HelperFunctions/calculateCommentLikes";

// import IndividualComment from "./IndividualComment";

const PostComments = ({ currentPost, currentSubreddit, allUsers, currentUser, post_id, currentLikes, currentComments, load }) => {
    const history = useHistory()
    const dispatch = useDispatch()

    // usestates for comment EDIT functionality
    const [commentBody, setCommentBody] = useState("")
    const [newCommentBody, setNewCommentBody] = useState(null)
    const [loadEditCommentComponent, setLoadEditCommentComponent] = useState(false)


    // usestates for comment LIKE functionality
    const [initialCommentLikesStatus, setInitialCommentLikesStatus] = useState(false)
    const [initialCommentLikes, setInitialCommentLikes] = useState({})
    const [modifiedCommentLikes, setModifiedCommentLikes] = useState({})
    const [likeTotal, setLikeTotal] = useState({})


    // useeffect to just find out what the like total is for each comment for a specific post
    useEffect(() => {
        if (currentComments.length > 0) {
            const likeTotalDict = {}
            Object.values(currentComments[0]).forEach(el => {
                likeTotalDict[el.id] = el.like_total
            })
            setLikeTotal({ ...likeTotal, ...likeTotalDict })
        }
    }, [currentComments])


    // ----------------------------------------- Functions ---------------------------------------------- //

    // initial like status for each comment
    const initialTempCommentsLiked = () => {
        setInitialCommentLikesStatus(true)

        if (currentLikes.length > 0) {
            const likeDict = {};

            Object.values(currentLikes[0]).forEach(el => {
                if (el.user_id === currentUser.id && el.like_status === "like") {
                    likeDict[el.comment_id] = "like"
                } else if (el.user_id === currentUser.id && el.like_status === "dislike") {
                    likeDict[el.comment_id] = "dislike"
                }

            })

            setInitialCommentLikes(initialCommentLikes => ({
                ...initialCommentLikes,
                ...likeDict
            }));
        }

    }

    // Comment Update
    const updateComment = async (e, el) => {
        e.preventDefault();

        let commentInfo = {
            body: newCommentBody
        }

        dispatch(commentActions.putCommentThunk(commentInfo, el))
        el.body = commentInfo.body

        setLoadEditCommentComponent(false)
    }

    // Comment Removal/Deletion
    const handleCommentDelete = (el) => {
        const confirmDelete = prompt(
            `Are you sure you want to delete this comment? You can't undo this`, "Yes"
        )

        if (confirmDelete === "Yes") {
            dispatch(commentActions.deleteCommentThunk(el))
        }
    }
    const handleCommentRemoval = (el) => {
        const confirmDelete = prompt(
            `Are you sure you want to remove this comment? You can't undo this`, "Yes"
        )

        if (confirmDelete === "Yes") {
            dispatch(commentActions.deleteCommentThunk(el))
        }
    }

    const likeHandler = (comment, commentLikeStatus) => {
        let likeInfo = {
            like_status: "like"
        }

        let updateValue = {}

        if (commentLikeStatus === "like") {
            dispatch(commentLikeActions.deleteLikeCommentThunk(comment.id))
            updateValue[comment.id] = "neutral"
        } else {
            if (commentLikeStatus === "dislike") {
                dispatch(commentLikeActions.deleteLikeCommentThunk(comment.id))
            }
            dispatch(commentLikeActions.createLikeCommentThunk(likeInfo, comment.id))
            updateValue[comment.id] = "like"
        }

        setModifiedCommentLikes(modifiedCommentLikes => ({
            ...modifiedCommentLikes,
            ...updateValue
        }))
    }

    const dislikeHandler = async (comment, commentLikeStatus) => {
        let likeInfo = {
            like_status: "dislike"
        }

        let updateValue = {}

        if (commentLikeStatus === "dislike") {
            dispatch(commentLikeActions.deleteLikeCommentThunk(comment.id))
            updateValue[comment.id] = "neutral"

        } else {
            if (commentLikeStatus === "like") {
                dispatch(commentLikeActions.deleteLikeCommentThunk(comment.id))
            }
            dispatch(commentLikeActions.createDislikeCommentThunk(likeInfo, comment.id))
            updateValue[comment.id] = "dislike"
        }
        setModifiedCommentLikes(modifiedCommentLikes => ({
            ...modifiedCommentLikes,
            ...updateValue
        }))

    }


    // -------------------------------------------------------------------------------------------------- //


    // ----------------------------------------- Components ---------------------------------------------- //
    const loadEditCommentSection = (commentToLoad) => {
        if (newCommentBody === null && commentToLoad.body) {
            setNewCommentBody(commentToLoad.body)
        }

        return (
            <form onSubmit={(e) => updateComment(e, commentToLoad)}>
                <textarea
                    type="text"
                    minLength={1}
                    value={newCommentBody}
                    onChange={(e) => setNewCommentBody(e.target.value)}
                >
                </textarea>
                <section>
                    <button onClick={() => setLoadEditCommentComponent(false)}>
                        Cancel
                    </button>
                    <button type="submit">
                        Save Edits
                    </button>
                </section>

            </form>
        )
    }

    const loadCommentFooter = (el, commentLikeStatus) => {
        return (
            currentUser === -1 ? (
                <div id="comments-remove-no-user"></div>
            ) : (

                <div id="comment-footer-main-container">
                    <aside id="comment-footer-vote-container">
                        <aside className="comment-vote-button" onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            likeHandler(el, commentLikeStatus)
                        }}>
                            <i className="fa-solid fa-up-long fa-lg" id={`comment-like-status-${commentLikeStatus}`}/>
                        </aside>
                        <aside id="comment-vote-display">
                            {likeTotal[el.id] + modifyCommentLikeTotal(el, initialCommentLikes, modifiedCommentLikes)}
                        </aside>

                        <aside className="comment-vote-button" onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            dislikeHandler(el, commentLikeStatus)
                        }}>
                            <i className="fa-solid fa-down-long fa-lg" id={`comment-dislike-status-${commentLikeStatus}`}/>
                        </aside>
                    </aside>
                    <aside>
                        {/* {IndividualComment({commentLikeStatus, setCommentLikeStatus})} */}
                    </aside>
                    {/* TO DO: Implement a comment edit function */}
                    {/* <aside onClick={() => setLoadEditCommentComponent(true)} id="comments-edit-container">
                        {
                            currentUser["id"] === el["user_id"] ? (
                                <div id="comments-footer-create-comment">
                                    <i className="fa-solid fa-pen" />
                                    <aside>
                                        Edit
                                    </aside>
                                </div>
                            ) : (
                                <div></div>
                            )
                        }
                    </aside> */}
                    <aside id="comments-footer-delete-container">
                        {currentUser["id"] === el["user_id"] ? (
                            <div id="comments-footer-delete-comment" onClick={() => handleCommentDelete(el)}>
                                <i className="fa-regular fa-trash-can" />
                                <aside className="comments-footer-text">
                                    Delete Comment
                                </aside>
                            </div>
                        ) : (
                            <div id="comments-footer-remove-comment" onClick={() => handleCommentRemoval(el)}>
                                <i className="fa-solid fa-ban" />
                                <aside className="comments-footer-text">
                                    Remove Comment
                                </aside>
                            </div>
                        )}
                    </aside>
                </div>
            )
        )
    }


    // Main Component
    const CommentsComponent = () => {
        if (currentComments.length > 0) {
            const commentsToLoad = Object.values(currentComments[0])

            if (!initialCommentLikesStatus) {
                initialTempCommentsLiked()
            }



            return (
                Array.isArray(commentsToLoad) && commentsToLoad.map((el, i) => {
                    calculateCommentLikes(el)

                    let commentPoster = -1;
                    if (allUsers[1]) {
                        commentPoster = allUsers[1][el["user_id"]]
                    }

                    let commentDate = el["created_at"].split(" ")
                    commentDate = commentDate[2] + " " + commentDate[1] + ", " + commentDate[3]

                    let commentLikeStatus = "neutral"

                    if (currentLikes[0][el.id] && currentLikes[0][el.id].user_id === currentUser.id) {
                        commentLikeStatus = currentLikes[0][el.id].like_status
                    }

                    if (modifiedCommentLikes[el.id]) {
                        commentLikeStatus = modifiedCommentLikes[el.id]
                    }


                    return (
                        <div id='comments-section-main-container' key={i}>
                            <section id="comments-section-header">
                                <img id="comments-section-poster-profile-pic"
                                    src={commentPoster["profile_image"]}
                                    width={30}
                                    height={30}
                                    alt="commentPosterProfileImage"
                                />
                                <aside onClick={(e) => redirectToUserPage(commentPoster.username, history, e)} id="comments-section-poster-username">
                                    {commentPoster["username"]}
                                </aside>
                                <aside>
                                    -
                                </aside>
                                <aside id="comments-section-date">
                                    {commentDate}
                                </aside>
                            </section>
                            <section id="comments-section-comment">
                                {loadEditCommentComponent ? (
                                    <section>
                                        {loadEditCommentSection(el)}
                                    </section>
                                ) : (
                                    <section>
                                        {el["body"]}
                                    </section>
                                )}
                            </section>
                            <section id="comments-section-footer">
                                {loadCommentFooter(el, commentLikeStatus)}
                            </section>
                        </div>
                    )
                })
            )
        } else {
            return (
                <div id='comments-section-no-comments'>
                    There are no comments yet. Why don't you fix that?
                </div>
            )
        }
    }
    // -------------------------------------------------------------------------------------------------- //


    // ----------------------------------------- Main Component ----------------------------------------- //
    return currentSubreddit.length > 0 && currentComments.length > 0 && currentPost.length > 0 && allUsers.length > 0 && load ? (
        <div>
            <aside id="post-page-comments-section-container">
                {CommentsComponent()}
            </aside>
        </div>
    ) : (
        <div></div>
    )
}

export default PostComments
