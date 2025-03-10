import { reduxError } from "./helper"

// ------------------------------- ACTIONS ------------------------------- //
const LOAD_COMMENTS = "LOAD_COMMENTS"
const CREATE_COMMENT = "CREATE_COMMENT"
const PUT_COMMENT = "PUT_COMMENT"
const DELETE_COMMENT = "DELETE_COMMENT"

// Get comments
export const loadComments = (comments) => {
    return {
        type: LOAD_COMMENTS,
        payload: comments
    }
}

// Create a new comment
export const createComment = (comment) => {
    return {
        type: CREATE_COMMENT,
        payload: comment
    }
}

// Update a comment
export const updateComment = (comment) => {
    return {
        type: PUT_COMMENT,
        payload: comment
    }
}

// Delete a comment
export const deleteComment = (comment) => {
    return {
        type: DELETE_COMMENT,
        payload: comment
    }
}


// ------------------------------- THUNKS ------------------------------- //

// load all comments
export const loadCommentsThunk = () => async () => {
    const res = await fetch(`/api/comments/`)
     const data = await res.json()
    return dispatch(loadComments(data))
}

// load one comment
export const loadCommentThunk = (commentId) => async () => {
    const res = await fetch(`/api/comments/${commentId}`)
     const data = await res.json()
    return dispatch(loadComments(data))
}

// load all comments by a specific user
export const loadUserCommentsThunk = (userId) => async () => {
    const res = await fetch(`/api/users/${userId}/comments`)
     const data = await res.json()
    return dispatch(loadComments(data))
}

// load all comments made by current user
export const loadCurrentUserCommentsThunk = () => async () => {
    const res = await fetch(`/api/users/current/comments`)
     const data = await res.json()
    return dispatch(loadComments(data))
}

// load all comments for a specific post
export const loadPostCommentsThunk = (postId) => async () => {
    const res = await fetch(`/api/posts/${postId}/comments`)
     const data = await res.json()
    return dispatch(loadComments(data))
}

// create a new comment on a post
export const createCommentOnPostThunk = (commentInfo, postId) => async (dispatch) => {
    const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(commentInfo)
    })

    const data = await res.json();
    return dispatch(createComment(data))
}

// create a new comment as a reply to another comment
export const createCommentOnCommentThunk = (commentInfo, commentId) => async (dispatch) => {
    const res = await fetch(`/api/comments/${commentId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(commentInfo)
    })

    const data = await res.json();
    return dispatch(createComment(data))
}


// update a comment
export const putCommentThunk = (commentInfo, comment) => async (dispatch) => {
    const res = await fetch(`/api/comments/${comment.id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentInfo)
    })

    const data = await res.json();
    return dispatch(updateComment(data))
}


// delete a comment
export const deleteCommentThunk = (comment) => async (dispatch) => {
    const res = await fetch(`/api/comments/${comment.id}`, {
        method: "DELETE"
    })

    const data = await res.json()
    return dispatch(deleteComment(data))
}


// ------------------------------ REDUCERS ------------------------------ //
const initialState = {
    commentsById: [],
    comments: {},
    errors: []
};

const commentReducer = (state = initialState, action) => {
    const newState = { ...state };
    const errorCheck = reduxError(newState, action.payload)

    // gets the id that would be returned from a single comment query
    const commentId = action.payload && "comment_by_id" in action.payload ? action.payload.comment_by_id[0] : null

    switch (action.type) {
        case LOAD_COMMENTS:
            if (errorCheck) return errorCheck
            newState.errors = []

            newState.commentsById = action.payload.comments_by_id
            newState.comments = action.payload.all_comments
            return newState
        case CREATE_COMMENT:
            if (errorCheck) return errorCheck
            newState.errors = []

            newState.commentsById.push(commentId)
            newState.comments[commentId] = action.payload.all_comments
            return newState
        case PUT_COMMENT:
            if (errorCheck) return errorCheck
            newState.errors = []

            newState.comments[commentId] = action.payload.all_comments
            return newState
        case DELETE_COMMENT:
            if (errorCheck) return errorCheck
            newState.errors = []

            newState.commentsById = newState.commentsById.filter(el => el !== commentId)
            delete newState[commentId]
            return newState
        default:
            return newState
    }
}

export default commentReducer
