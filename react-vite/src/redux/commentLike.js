// ------------------------------- ACTIONS ------------------------------- //
const LOAD_COMMENT_LIKES = '/likes/LOAD_COMMENT_LIKES'
const CREATE_COMMENT_LIKES = '/likes/CREATE_COMMENT_LIKES'
// const PUT_COMMENT_LIKES = '/likes/PUT_COMMENT_LIKES'
const DELETE_COMMENT_LIKES = '/likes/DELETE_COMMENT_LIKES'
const CLEAR_COMMENT_LIKES = "/likes/CLEAR_COMMENT_LIKES"


// Get likes for a comment
export const loadLikesComment = (likes) => {
    return {
        type: LOAD_COMMENT_LIKES,
        likes
    }
}

// Get likes from user
export const loadUserCommentLikes = (likes) => {
    return {
        type: LOAD_COMMENT_LIKES,
        likes
    }
}

// create likes for comment
export const createLikeComment = (commentId) => {
    return {
        type: CREATE_COMMENT_LIKES,
        commentId
    }
}

// // edit like for a comment
// export const putLikesComment = (commentId) => {
//     return {
//         type: PUT_COMMENT_LIKES,
//         commentId
//     }
// }

// delete like for a post
export const deleteLikeComment = (commentId) => {
    return {
        type: DELETE_COMMENT_LIKES,
        commentId
    }
}

export const clearCommentLikes = () => {
    return {
        type: CLEAR_COMMENT_LIKES,
    }
}


// ------------------------------- THUNKS ------------------------------- //

// Thunk action to load likes for a comment
export const loadLikesCommentThunk = (commentId) => async (dispatch) => {
    const res = await fetch(`/api/comment_likes/comments/${commentId}`)

    if (res.ok) {
        const likes = await res.json()
        dispatch(loadLikesComment(likes))
        return likes
    }
}

// Thunk action to load all likes made to comments
export const loadAllLikesCommentThunk = () => async (dispatch) => {
    const res = await fetch(`/api/comment_likes/`)

    if (res.ok) {
        const likes = await res.json()
        dispatch(loadCommentLikes(likes))
        return likes
    }
}


// // Thunk action to load all likes made to comments that belong to a specific post
// export const loadAllCommentLikesPerPostThunk = (post_id) => async (dispatch) => {
//     const res = await fetch(`/api/likes/all/comments/${post_id}`)

//     if(res.ok) {
//         const likes = await res.json()
//         dispatch(loadLikesComment(likes))
//         return likes
//     }
// }

// Thunk action to load likes from everyone
export const loadAllCommentLikesThunk = () => async (dispatch) => {
    const res = await fetch(`/api/comment_likes`)

    if (res.ok) {
        const likes = await res.json()
        dispatch(loadLikesComment(likes))
        return likes
    }
    return null
}

// Thunk action to load likes from current user
export const loadUserCommentLikesThunk = () => async (dispatch) => {
    const res = await fetch(`/api/comment_likes/users/current`)

    if (res.ok) {
        const likes = await res.json()
        dispatch(loadUserCommentLikes(likes))
        return likes
    } else {
        return null
    }
}


export const createLikeCommentThunk = (likeInfo, commentId) => async (dispatch) => {
    // TO DO
    const res = await fetch(`/api/comment_likes/comments/${commentId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(likeInfo),
    })

    if (res.ok) {
        const like = await res.json()
        dispatch(createLikeComment(like))
        return like
    }

    return null
}

// export const createLikePostThunk = (likeInfo, postId) => async (dispatch) => {
//     const res = await fetch(`/api/post_likes/posts/${postId}`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(likeInfo),
//     })

//     if (res.ok) {
//         const like = await res.json()
//         dispatch(createLikePost(like))
//         return like
//     }

//     return null
// }

export const createDislikeCommentThunk = (dislikeInfo, commentId) => async (dispatch) => {
    const res = await fetch(`/api/comment_likes/comments/${commentId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dislikeInfo),
    })

    if (res.ok) {
        const dislike = await res.json()
        dispatch(createLikeComment(dislike))
        return dislike
    }
}

// export const createDislikePostThunk = (dislikeInfo, postId) => async (dispatch) => {
//     const res = await fetch(`/api/post_likes/posts/${postId}`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(dislikeInfo),
//     })

//     if (res.ok) {
//         const dislike = await res.json()
//         dispatch(createLikePost(dislike))
//         return dislike
//     }

//     return null
// }



// export const deleteLikePostThunk = (postId) => async (dispatch) => {
//     const res = await fetch(`/api/post_likes/posts/${postId}`, {
//         method: "DELETE"
//     })

//     if (res.ok) {
//         dispatch(deleteLikePost(postId))
//         return true;
//     }

//     return null;
// }

export const deleteLikeCommentThunk = (commentId) => async (dispatch) => {
    const res = await fetch(`/api/comment_likes/comments/${commentId}`, {
        method: "DELETE"
    })

    if (res.ok) {
        dispatch(deleteLikeComment(commentId))
        return true;
    }

    return null;
}



// ------------------------- SELECTOR FUNCTIONS ------------------------- //

export const loadCommentLikes = (state) => state.commentLikes


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
