// ------------------------------- ACTIONS ------------------------------- //
const LOAD_COMMENT_LIKES = 'LOAD_COMMENT_LIKES'
const CREATE_COMMENT_LIKES = 'CREATE_COMMENT_LIKES'
// const PUT_COMMENT_LIKES = 'PUT_COMMENT_LIKES'
const DELETE_COMMENT_LIKES = 'DELETE_COMMENT_LIKES'


// Get likes for a comment
export const loadLikesComment = (likes) => {
    return {
        type: LOAD_COMMENT_LIKES,
        payload: likes
    }
}

// Get likes from user
export const loadUserCommentLikes = (likes) => {
    return {
        type: LOAD_COMMENT_LIKES,
        payload: likes
    }
}

// create likes for comment
export const createLikeComment = (commentId) => {
    return {
        type: CREATE_COMMENT_LIKES,
        payload: commentId
    }
}

// // edit like for a comment
// export const putLikesComment = (commentId) => {
//     return {
//         type: PUT_COMMENT_LIKES,
//         commentId
//     }
// }

// delete like for a comment
export const deleteLikeComment = (commentId) => {
    return {
        type: DELETE_COMMENT_LIKES,
        payload: commentId
    }
}

// ------------------------------- THUNKS ------------------------------- //

// load all likes/dislikes for a commment
export const loadCommentLikesThunk = (commentId) => async (dispatch) => {
    const res = await fetch(`/api/comments/${commentId}/likes`)

    const likes = await res.json()
    return dispatch(loadLikesComment(likes))
}

// load like status for a comment made by current user
export const loadCurrentUserCommentLikesThunk = (commentId) => async (dispatch) => {
    const res = await fetch(`/api/users/current/comments/${commentId}/likes`)

    const data = await res.json()
    return dispatch(loadLikesComment(data))
}

// load all comment likes made by a specific user
export const loadUserCommentLikesThunk = (userId) => async (dispatch) => {
    const res = await fetch(`/api/users/${userId}/comment_likes`)

    const data = await res.json()
    return dispatch(loadLikesComment(data))
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
    dispatch(createLikeComment(like))
}

// redundant
// export const createDislikeCommentThunk = (dislikeInfo, commentId) => async (dispatch) => {
//     const res = await fetch(`/api/comments/${commentId}/likes`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(dislikeInfo),
//     })

//     const data = await res.json()
//     dispatch(createLikeComment(data))
// }

export const deleteCommentLikesThunk = (commentId) => async (dispatch) => {
    const res = await fetch(`/api/comments/${commentId}/likes`, {
        method: "DELETE"
    })

    const data = await res.json()
    dispatch(deleteLikeComment(data))
}

// ------------------------------ REDUCERS ------------------------------ //

const initialState = {};

const commentLikesReducer = (state = initialState, action) => {
    const newState = { ...state }

    switch (action.type) {
        case LOAD_COMMENT_LIKES:
            return Object.assign({}, newState, action.likes);

        case CREATE_COMMENT_LIKES:
            return Object.assign({}, newState, action.likes);

        case DELETE_COMMENT_LIKES:
            return Object.assign({}, newState, action.commentId);

        case CLEAR_COMMENT_LIKES:
            return initialState

        default:
            return newState
    }
}


export default commentLikesReducer
