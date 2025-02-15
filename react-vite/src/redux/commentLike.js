import { reduxError } from "./helper"

// ------------------------------- ACTIONS ------------------------------- //
const LOAD_COMMENT_LIKES = 'LOAD_COMMENT_LIKES'
const CREATE_COMMENT_LIKES = 'CREATE_COMMENT_LIKES'
// const PUT_COMMENT_LIKES = 'PUT_COMMENT_LIKES'
const DELETE_COMMENT_LIKES = 'DELETE_COMMENT_LIKES'


// Get likes for a comment
export const loadCommentLikes = (likes) => {
    return {
        type: LOAD_COMMENT_LIKES,
        payload: likes
    }
}


// create likes for comment
export const createCommentLike = (commentId) => {
    return {
        type: CREATE_COMMENT_LIKES,
        payload: commentId
    }
}

// // TODO: test if updating a like is viable
// export const putLikesComment = (commentId) => {
//     return {
//         type: PUT_COMMENT_LIKES,
//         commentId
//     }
// }

// delete like for a comment
export const deleteCommentLike = (commentId) => {
    return {
        type: DELETE_COMMENT_LIKES,
        payload: commentId
    }
}

// -------------------------- Dispatch helper -------------------------- //
const dispatchHelper = (res) => async (dispatch) => {
    const data = await res.json()
    return dispatch(loadCommentLikes(data))
}

// ------------------------------- THUNKS ------------------------------- //

// load all likes/dislikes for a commment
export const loadCommentLikesThunk = (commentId) => async () => {
    const res = await fetch(`/api/comments/${commentId}/likes`)
    return dispatchHelper(res)
}

// load like status for a comment made by current user
export const loadCurrentUserCommentLikesThunk = (commentId) => async () => {
    const res = await fetch(`/api/users/current/comments/${commentId}/likes`)
    return dispatchHelper(res)
}

// load all comment likes made by a specific user
export const loadUserCommentLikesThunk = (userId) => async () => {
    const res = await fetch(`/api/users/${userId}/comment_likes`)
    return dispatchHelper(res)
}

export const createCommentLikesThunk = (likeInfo, commentId) => async (dispatch) => {
    // TO DO
    const res = await fetch(`/api/comments/${commentId}/likes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(likeInfo),
    })

    const like = await res.json()
    dispatch(createCommentLike(like))
}

// // TODO: test if updating a like is viable

export const deleteCommentLikesThunk = (commentId) => async (dispatch) => {
    const res = await fetch(`/api/comments/${commentId}/likes`, {
        method: "DELETE"
    })

    const data = await res.json()
    dispatch(deleteCommentLike(data))
}

// ------------------------------ REDUCERS ------------------------------ //

const initialState = {
    commentLikesById: [],
    commentLikes: {},
    errors: []
};

const commentLikesReducer = (state = initialState, action) => {
    const newState = { ...state }
    const errorCheck = reduxError(newState, action.payload)

    // gets the id that would be returned from a single post query
    const commentLikeId = action.payload && "comment_likes_by_id" in action.payload ? action.payload.comment_likes_by_id[0] : null

    switch (action.type) {
        case LOAD_COMMENT_LIKES:
            if (errorCheck) return errorCheck
            newState.errors = []

            newState.commentLikesById = action.payload.comment_likes_by_id
            newState.commentLikes = action.payload.all_comment_likes
            return newState
        case CREATE_COMMENT_LIKES:
            if (errorCheck) return errorCheck
            newState.errors = []

            newState.commentLikesById.push(commentLikeId)
            newState.commentLikes[commentLikeId] = action.payload.all_comment_likes
            return newState
        case DELETE_COMMENT_LIKES:
            if (errorCheck) return errorCheck
            newState.errors = []

            newState.commentLikesById = newState.commentLikesById.filter(el !== commentLikeId)
            delete newState.commentLikes[commentLikeId]
            return newState
        default:
            return newState
    }
}


export default commentLikesReducer
