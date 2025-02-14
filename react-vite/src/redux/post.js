import { reduxError } from "./helper"

// ------------------------------- ACTIONS ------------------------------- //
const LOAD_POST = 'LOAD_POST'
const LOAD_POSTS = 'LOAD_POSTS'
const CREATE_POST = 'CREATE_POST'
const PUT_POST = 'PUT_POST'
const DELETE_POST = 'DELETE_POST'

// Get one post
export const loadPost = (post) => {
    return {
        type: LOAD_POST,
        payload: post
    }
}

// Get all posts
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
export const deletePost = (postId) => {
    return {
        type: DELETE_POST,
        payload: postId
    }
}


// ------------------------------- THUNKS ------------------------------- //

// load a specific post
export const loadPostThunk = (postId) => async (dispatch) => {
    const res = await fetch(`/api/posts/${postId}`)

    const data = await res.json();
    return dispatch(loadPost(data))
}

// load all posts
export const loadPostsThunk = () => async (dispatch) => {
    const res = await fetch(`/api/posts/`)

    if (res.ok) {
        const posts = await res.json();
        dispatch(loadPosts(posts))
        return posts
    }
}

// load a user's posts
export const loadUserPostsThunk = (userId) => async (dispatch) => {
    const res = await fetch(`/api/users/${userId}/posts`)

    const data = await res.json()
    return dispatch(loadPosts(data))
}

// load current user's posts
export const loadCurrentUserPostsThunk = () =>  async (dispatch) => {
    const res = await fetch(`/api/users/current/posts`)

    const data = await res.json()
    return dispatch(loadPosts(data))
}

// load a subreddit's posts
export const loadSubredditPostsThunk = (subredditId) => async (dispatch) => {
    const res = await fetch(`/api/subreddits/${subredditId}/posts`)

    const data = await res.json()
    return dispatch(loadPosts(data))
}

// create a new post
export const createPostThunk = (postInfo) => async (dispatch) => {
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

    switch (action.type) {
        case LOAD_POST:
            if (errorCheck) return errorCheck
            newState.errors = []
            newState.postsById = [action.payload.id]
            newState.posts = action.payload

            return newState
        case LOAD_POSTS:
            if (errorCheck) return errorCheck
            newState.errors = []

            newState.postsById = action.payload.post_by_id
            newState.posts = action.payload.all_posts

            return newState
        case CREATE_POST:
            if (errorCheck) return errorCheck
            newState.errors = []

            return newState
        case PUT_POST:
            if (errorCheck) return errorCheck
            newState.errors = []
            newState.posts[action.payload.id] = action.payload

            return newState
        case DELETE_POST:
            if (errorCheck) return errorCheck
            newState.errors = []

            const deletePostId = newState.postsById.filter(el => el !== action.payload.id)
            newState.postsById = deletePostId
            delete newState[action.payload.id]
            return newState
        default:
            return newState
    }
}

export default postReducer
