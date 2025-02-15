import { reduxError } from "./helper"

// ------------------------------- ACTIONS ------------------------------- //
const LOAD_POSTS = 'LOAD_POSTS'
const CREATE_POST = 'CREATE_POST'
const PUT_POST = 'PUT_POST'
const DELETE_POST = 'DELETE_POST'

// Get posts
export const loadPosts = (posts) => {
    return {
        type: LOAD_POSTS,
        payload: posts
    }
}

// Create a new post
export const createPost = (post) => {
    return {
        type: CREATE_POST,
        payload: post
    }
}

// Update a post
export const updatePost = (post) => {
    return {
        type: PUT_POST,
        payload: post
    }
}

// Delete a post
export const deletePost = (post) => {
    return {
        type: DELETE_POST,
        payload: post
    }
}

// -------------------------- Dispatch helper -------------------------- //
const dispatchHelper = (res) => async (dispatch) => {
    const data = await res.json()
    return dispatch(loadPosts(data))
}

// ------------------------------- THUNKS ------------------------------- //
// load all posts
export const loadPostsThunk = () => async () => {
    const res = await fetch(`/api/posts/`)
    return dispatchHelper(res)
}

// load a specific post
export const loadPostThunk = (postId) => async () => {
    const res = await fetch(`/api/posts/${postId}`)
    return dispatchHelper(res)
}

// load a specific user's posts
export const loadUserPostsThunk = (userId) => async () => {
    const res = await fetch(`/api/users/${userId}/posts`)
    return dispatchHelper(res)
}

// load current user's posts
export const loadCurrentUserPostsThunk = () => async () => {
    const res = await fetch(`/api/users/current/posts`)
    return dispatchHelper(res)
}

// load a subreddit's posts
export const loadSubredditPostsThunk = (subredditId) => async () => {
    const res = await fetch(`/api/subreddits/${subredditId}/posts`)
    return dispatchHelper(res)
}

// create a new post
export const createPostThunk = (postInfo) => async () => {
    const res = await fetch(`/api/posts/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(postInfo),
    })

    const data = await res.json();
    return dispatch(createPost(data))
}

// update an existing post
export const putPostThunk = (postInfo, postId) => async (dispatch) => {
    const res = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postInfo)
    })

    const data = await res.json();
    return dispatch(updatePost(data))
}

// delete a post
export const deletePostThunk = (postId) => async (dispatch) => {
    const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE"
    })

    const data = await res.json();
    return dispatch(deletePost(data))
}

// ------------------------------ REDUCERS ------------------------------ //

const initialState = {
    postsById: [],
    posts: {},
    errors: []
};

const postReducer = (state = initialState, action) => {
    const newState = { ...state };
    const errorCheck = reduxError(newState, action.payload)

    // gets the id that would be returned from a single post query
    const postId = action.payload && "posts_by_id" in action.payload ? action.payload.posts_by_id[0] : null

    switch (action.type) {
        case LOAD_POSTS:
            if (errorCheck) return errorCheck
            newState.errors = []

            newState.postsById = action.payload.posts_by_id
            newState.posts = action.payload.all_posts
            return newState
        case CREATE_POST:
            if (errorCheck) return errorCheck
            newState.errors = []

            newState.postsById.push(postId)
            newState.posts[postId] = action.payload.all_posts
            return newState
        case PUT_POST:
            if (errorCheck) return errorCheck
            newState.errors = []

            newState.posts[postId] = action.payload.all_posts
            return newState
        case DELETE_POST:
            if (errorCheck) return errorCheck
            newState.errors = []

            newState.postsById = newState.postsById.filter(el => el !== postId)
            delete newState[postId]
            return newState
        default:
            return newState
    }
}

export default postReducer
