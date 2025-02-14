// ------------------------------- ACTIONS ------------------------------- //
const LOAD_POST_LIKES = 'LOAD_POST_LIKES'
const LOAD_CURR_POST_LIKES = 'LOAD_CURR_POST_LIKES'
const CREATE_POST_LIKES = 'CREATE_POST_LIKES'
// const PUT_POST_LIKES = 'PUT_POST_LIKES'
const DELETE_POST_LIKES = 'DELETE_POST_LIKES'
const CLEAR_POST_LIKES = "CLEAR_POST_LIKES"

// Get likes for a post
export const loadLikesPost = (likes) => {
    return {
        type: LOAD_POST_LIKES,
        payload: likes
    }
}

// Get likes from user
export const loadUserPostLikes = (likes) => {
    return {
        type: LOAD_CURR_POST_LIKES,
        payload: likes
    }
}

// create likes/dislikes for a post
export const createLikePost = (likes) => {
    return {
        type: CREATE_POST_LIKES,
        payload: likes
    }
}


// // edit like for a post
// export const putLikesPost = (postId) => {
//     return {
//         type: PUT_POST_LIKES,
//         postId
//     }
// }

// // edit like for a comment
// export const putLikesComment = (commentId) => {
//     return {
//         type: PUT_POST_LIKES,
//         commentId
//     }
// }

// delete like for a post
export const deleteLikePost = (postId) => {
    return {
        type: DELETE_POST_LIKES,
        payload: postId
    }
}

export const clearPostLikes = () => {
    return {
        type: CLEAR_POST_LIKES,
    }
}


// ------------------------------- THUNKS ------------------------------- //

// load likes for a post
export const loadLikesPostThunk = (postId) => async (dispatch) => {
    const res = await fetch(`/api/posts/${postId}/likes`)

    const likes = await res.json()
    return dispatch(loadLikesPost(likes))
}


// load post likes from current user
export const loadCurrentUserPostLikesThunk = (postId) => async (dispatch) => {
    const res = await fetch(`/api/users/current/posts/${postId}/likes`)

    const likes = await res.json()
    return dispatch(loadUserPostLikes(likes))
}

// load all post likes from a specific user
export const loadUserPostLikesThunk = (userId) => async (dispatch) => {
    const res = await fetch(`/api/users/${userId}/post_likes`)

    const data = await res.json()
    return dispatch(loadLikesPost(data))
}

// create a like/dislike on a post
export const createLikePostThunk = (likeInfo, postId) => async (dispatch) => {
    const res = await fetch(`/api/posts/${postId}/likes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(likeInfo),
    })

    if (res.ok) {
        const like = await res.json()
        dispatch(createLikePost(like))
        return like
    }

    return null
}

// redundant
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


export const deleteLikePostThunk = (postId) => async (dispatch) => {
    const res = await fetch(`/api/posts/${postId}/likes`, {
        method: "DELETE"
    })

    const data = await res.json()
    return dispatch(deleteLikePost(data))
}


// ------------------------------ REDUCERS ------------------------------ //

const initialState = {};

const postLikesReducer = (state = initialState, action) => {
    const newState = { ...state }

    switch (action.type) {
        // case LOAD_POST_LIKES:
        //     return Object.assign({}, newState, action.likes);

        // case LOAD_CURR_POST_LIKES:
        //      return
        // case CREATE_POST_LIKES:
        //     return Object.assign({}, newState, action.postLikes);

        // case DELETE_POST_LIKES:
        //     return Object.assign({}, newState, action.postId);

        // case CLEAR_POST_LIKES:
        //     return initialState

        default:
            return newState
    }
}


export default postLikesReducer
