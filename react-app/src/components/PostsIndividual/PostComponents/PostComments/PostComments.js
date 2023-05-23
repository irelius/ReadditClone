import "./PostComments.css"

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom"

import * as commentActions from "../../../../store/comment"
import * as commentLikeActions from "../../../../store/commentLike"

import redirectToUserPage from "../../../HelperFunctions/redirectToUserPage";
import modifyCommentLikeTotal from "../../../HelperFunctions/modifyCommentLikeTotal";

// import IndividualComment from "./IndividualComment";

const PostComments = ({ currentPost, currentSubreddit, allUsers, currentUser, post_id, currentLikes, currentComments, load }) => {
    const dispatch = useDispatch()
    const history = useHistory()

    const [errors, setErrors] = useState([])
    const [commentBody, setCommentBody] = useState("")
    const [newCommentBody, setNewCommentBody] = useState(null)
    const [loadEditCommentComponent, setLoadEditCommentComponent] = useState(false)
    const [allCommentLikeStatus, setAllCommentLikeStatus] = useState({})
    const [likeTotal, setLikeTotal] = useState({})

    const [initialCommentLikeStatuses, setInitialCommentLikeStatuses] = useState(false)

    // useEffect(() => {
    //     if (currentLikes.length > 0) {
    //         const likeDict = {};

    // Object.values(currentLikes[0]).forEach(el => {
    //             if (el.user_id === currentUser.id && el.like_status === "like") {
    //                 likeDict[el.comment_id] = "like"
    //             } else if (el.user_id === currentUser.id && el.like_status === "dislike") {
    //                 likeDict[el.comment_id] = "dislike"
    //             }

    //         })

    //         setAllCommentLikeStatus({ ...likeDict });
    //     }

    // }, [currentLikes]);

    useEffect(() => {
        if (currentComments.length > 0) {
            const likeTotalDict = {}
            Object.values(currentComments[0]).forEach(el => {
                likeTotalDict[el.id] = el.like_total
            })
            setLikeTotal({ ...likeTotal, ...likeTotalDict })
        }
    }, [currentComments])

    // const CommentsComponent = () => {
    //     const commentsToLoad = Object.values(currentComments[0])
    //     return (
    //         Array.isArray(commentsToLoad) && commentsToLoad.map((el, i) => {
    //             return (
    //                 <div>
    //                     {IndividualComment()}
    //                 </div>
    //             )
    //         })
    //     )
    // }


    // ----------------------------------------- Functions ---------------------------------------------- //

    const initialTempCommentsLiked = () => {
        setInitialCommentLikeStatuses(true)

        if (currentLikes.length > 0) {
            const likeDict = {};

            Object.values(currentLikes[0]).forEach(el => {
                if (el.user_id === currentUser.id && el.like_status === "like") {
                    likeDict[el.comment_id] = "like"
                } else if (el.user_id === currentUser.id && el.like_status === "dislike") {
                    likeDict[el.comment_id] = "dislike"
                }

            })

            setAllCommentLikeStatus(allCommentLikeStatus => ({...allCommentLikeStatus, ...likeDict }));
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

    const likeHandler = async (comment, commentLikeStatus) => {
        let likeInfo = {
            like_status: "like"
        }

        let updateValue = {}

        if (commentLikeStatus === "like") {
            await dispatch(commentLikeActions.deleteLikeCommentThunk(comment.id)).then(() => (
                dispatch(commentLikeActions.loadUserCommentLikesThunk())
            ))

            updateValue[comment.id] = "neutral"
            // setAllCommentLikeStatus({ ...allCommentLikeStatus, [comment.id]: "neutral" })
        } else {
            await dispatch(commentLikeActions.deleteLikeCommentThunk(comment.id)).then(() =>
                dispatch(commentLikeActions.createLikeCommentThunk(likeInfo, comment.id)).then(() => (
                    dispatch(commentLikeActions.loadUserCommentLikesThunk())
                ))
            )

            updateValue[comment.id] = "like"

            // setAllCommentLikeStatus({ ...allCommentLikeStatus, [commentToLoad.id]: "like" })
        }

        setAllCommentLikeStatus(allCommentLikeStatus => ({
            ...allCommentLikeStatus,
            ...updateValue
        }))
    }

    const dislikeHandler = async (commentToLoad, commentLikeStatus) => {
        let likeInfo = {
            like_status: "dislike"
        }

        if (commentLikeStatus === "dislike") {
            dispatch(commentLikeActions.deleteLikeCommentThunk(commentToLoad.id)).then(() => (
                dispatch(commentLikeActions.loadUserCommentLikesThunk())
            ))

            setAllCommentLikeStatus({ ...allCommentLikeStatus, [commentToLoad.id]: "neutral" })
        } else {
            dispatch(commentLikeActions.deleteLikeCommentThunk(commentToLoad.id))
            dispatch(commentLikeActions.createDislikeCommentThunk(likeInfo, commentToLoad.id)).then(() => (
                dispatch(commentLikeActions.loadUserCommentLikesThunk())
            ))

            setAllCommentLikeStatus({ ...allCommentLikeStatus, [commentToLoad.id]: "dislike" })
        }
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

    const loadCommentFooter = (el) => {
        return (
            currentUser === -1 ? (
                <div id="comments-remove-no-user"></div>
            ) : (

                <div id="comment-footer-main-container">
                    <aside id="comment-footer-vote-container">
                        <aside onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            likeHandler(el, allCommentLikeStatus[el.id])
                        }}>
                            <i className="fa-solid fa-up-long fa-lg" />
                        </aside>

                        {likeTotal[el.id] + modifyCommentLikeTotal(el, initialCommentLikeStatuses, allCommentLikeStatus)}

                        <aside onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            dislikeHandler(el, allCommentLikeStatus[el.id])
                        }}>
                            <i className="fa-solid fa-down-long fa-lg" />
                        </aside>
                    </aside>
                    <aside>
                        {/* {IndividualComment({commentLikeStatus, setCommentLikeStatus})} */}
                    </aside>
                    {/* TO DO: Implement a comment edit function */}
                    <aside onClick={() => setLoadEditCommentComponent(true)} id="comments-edit-container">
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
                    </aside>
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

            if (!initialCommentLikeStatuses) {
                initialTempCommentsLiked()
            }


            return (
                Array.isArray(commentsToLoad) && commentsToLoad.map((el, i) => {
                    let commentPoster = -1;
                    if (allUsers[1]) {
                        commentPoster = allUsers[1][el["user_id"]]
                    }

                    let commentDate = el["created_at"].split(" ")
                    commentDate = commentDate[2] + " " + commentDate[1] + ", " + commentDate[3]

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
                                {loadCommentFooter(el)}
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
