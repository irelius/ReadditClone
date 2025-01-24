// ------------------------------- ACTIONS ------------------------------- //
const LOAD_POST_LIKES = '/likes/LOAD_POST_LIKES'
const CREATE_POST_LIKES = '/likes/CREATE_POST_LIKES'
// const PUT_POST_LIKES = '/likes/PUT_POST_LIKES'
const DELETE_POST_LIKES = '/likes/DELETE_POST_LIKES'
const CLEAR_POST_LIKES = "/likes/CLEAR_POST_LIKES"

// Get likes for a post
export const loadLikesPost = (likes) => {
    return {
        type: LOAD_POST_LIKES,
        likes
    }
}

// Get likes from user
export const loadUserPostLikes = (likes) => {
    return {
        type: LOAD_POST_LIKES,
        likes
    }
}

// create likes/dislikes for a post
export const createLikePost = (likes) => {
    return {
        type: CREATE_POST_LIKES,
        likes
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
        postId
    }
}

export const clearPostLikes = () => {
    return {
        type: CLEAR_POST_LIKES,
    }
}


// ------------------------------- THUNKS ------------------------------- //

// Thunk action to load likes for a post
export const loadLikesPostThunk = (postId) => async (dispatch) => {
    const res = await fetch(`/api/post_likes/posts/${postId}`)


    if (res.ok) {
        const likes = await res.json()
        dispatch(loadLikesPost(likes))
        return likes
    }
}


// Thunk action to load all likes made to posts
export const loadAllLikesPostThunk = () => async (dispatch) => {
    const res = await fetch(`/api/post_likes/`)

    if (res.ok) {
        const likes = await res.json()
        dispatch(loadLikesPost(likes))
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


// Thunk action to load post likes from current user
export const loadUserPostLikesThunk = () => async (dispatch) => {
    const res = await fetch(`/api/post_likes/users/current`)

    if (res.ok) {
        const likes = await res.json()
        dispatch(loadUserPostLikes(likes))
        return likes
    }
}


export const createLikePostThunk = (likeInfo, postId) => async (dispatch) => {
    const res = await fetch(`/api/post_likes/posts/${postId}`, {
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

export const createDislikePostThunk = (dislikeInfo, postId) => async (dispatch) => {
    const res = await fetch(`/api/post_likes/posts/${postId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dislikeInfo),
    })

    if (res.ok) {
        const dislike = await res.json()
        dispatch(createLikePost(dislike))
        return dislike
    }

    return null
}


export const deleteLikePostThunk = (postId) => async (dispatch) => {
    const res = await fetch(`/api/post_likes/posts/${postId}`, {
        method: "DELETE"
    })

    if (res.ok) {
        dispatch(deleteLikePost(postId))
        return true;
    }

    return null;
}

// Object { type: "/likes/DELETE_POST_LIKES", postId: 2 }
// postId: 2
// type: "/likes/DELETE_POST_LIKES"

// ------------------------- SELECTOR FUNCTIONS ------------------------- //

export const loadPostLikes = (state) => state.postLikes


// ------------------------------ REDUCERS ------------------------------ //

const initialState = {};

const postLikesReducer = (state = initialState, action) => {
    const newState = { ...state }

    switch (action.type) {
        // case LOAD_POST_LIKES:
        //     return Object.assign({}, newState, action.likes);

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
