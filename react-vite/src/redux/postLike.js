import { reduxError } from "./helper";

// ------------------------------- ACTIONS ------------------------------- //
const LOAD_POST_LIKES = "LOAD_POST_LIKES";
const CREATE_POST_LIKES = "CREATE_POST_LIKES";
// const PUT_POST_LIKES = 'PUT_POST_LIKES'
const DELETE_POST_LIKES = "DELETE_POST_LIKES";

// Get likes for a post
export const loadPostLikes = (likes) => {
    return {
        type: LOAD_POST_LIKES,
        payload: likes,
    };
};

// create likes/dislikes for a post
export const createPostLike = (likes) => {
    return {
        type: CREATE_POST_LIKES,
        payload: likes,
    };
};

// // edit like for a post, TODO: see if this is viable
// export const putLikesPost = (postId) => {
//     return {
//         type: PUT_POST_LIKES,
//         postId
//     }
// }

// delete like for a post
export const deletePostLike = (postId) => {
    return {
        type: DELETE_POST_LIKES,
        payload: postId,
    };
};


// ------------------------------- THUNKS ------------------------------- //

// load likes for a post
export const loadLikesPostThunk = (postId) => async () => {
    const res = await fetch(`/api/posts/${postId}/likes`);
    const data = await res.json();
    return dispatch(loadPostLikes(data));
};

// load post likes from current user
export const loadCurrentUserPostLikesThunk = (postId) => async () => {
    const res = await fetch(`/api/users/current/posts/${postId}/likes`);
    const data = await res.json();
    return dispatch(loadPostLikes(data));
};

// load all post likes from a specific user
export const loadUserPostLikesThunk = (userId) => async () => {
    const res = await fetch(`/api/users/${userId}/post_likes`);
    const data = await res.json();
    return dispatch(loadPostLikes(data));
};

// create a like/dislike on a post
export const createLikePostThunk = (likeInfo, postId) => async (dispatch) => {
    const res = await fetch(`/api/posts/${postId}/likes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(likeInfo),
    });

    const data = await res.json();
    return dispatch(createPostLike(data));
};

// TODO: see if editing a post like is viable

export const deleteLikePostThunk = (postId) => async (dispatch) => {
    const res = await fetch(`/api/posts/${postId}/likes`, {
        method: "DELETE",
    });

    const data = await res.json();
    return dispatch(deletePostLike(data));
};

// ------------------------------ REDUCERS ------------------------------ //

const initialState = {
    postLikesById: [],
    postLikes: {},
    errors: [],
};

const postLikesReducer = (state = initialState, action) => {
    const newState = { ...state };
    const errorCheck = reduxError(newState, action.payload);

    // gets the id that would be returned from a single post like query
    const postLikeId =
        action.payload && "post_likes_by_id" in action.payload
            ? action.payload.post_likes_by_id[0]
            : null;

    switch (action.type) {
        case LOAD_POST_LIKES:
            if (errorCheck) return errorCheck;
            newState.errors = [];

            newState.postLikesById = action.payload.post_likes_by_id;
            newState.postLikes = action.payload.all_post_likes;
            return newState;
        case CREATE_POST_LIKES:
            if (errorCheck) return errorCheck;
            newState.errors = [];

            newState.postLikesById.push(postLikeId);
            newState.postLikes[postLikeId] = action.payload.all_post_likes;
            return newState;
        case DELETE_POST_LIKES:
            if (errorCheck) return errorCheck;
            newState.errors = [];

            newState.postLikesById = newState.postLikesById.filter(
                (el) => el !== postLikeId
            );
            delete newState.postLikes[postLikeId];
            return newState;
        default:
            return newState;
    }
};

export default postLikesReducer;
