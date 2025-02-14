import { reduxError } from "./helper"

// ------------------------------- ACTIONS ------------------------------- //
const LOAD_COMMENT = "LOAD_COMMENT"
const LOAD_CURR_COMMENTS = "LOAD_CURR_COMMENTS"
const LOAD_COMMENTS = "LOAD_COMMENTS"
const CREATE_COMMENT = "CREATE_COMMENT"
const PUT_COMMENT = "PUT_COMMENT"
const DELETE_COMMENT = "DELETE_COMMENT"

// Get one comment
export const loadComment = (comment) => {
    return {
        type: LOAD_COMMENT,
        payload: comment
    }
}

// Get all comments
export const loadComments = (comments) => {
    return {
        type: LOAD_COMMENTS,
        payload: comments
    }
}

export const loadCurrComments = (comments) => {
    return {
        type: LOAD_CURR_COMMENTS,
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
export const loadCommentsThunk = () => async (dispatch) => {
    const res = await fetch(`/api/comments`)

    if (res.ok) {
        const comments = await res.json();
        dispatch(loadComments(comments))
        return comments
    }
}

// load one comment
export const loadCommentThunk = (commentId) => async (dispatch) => {
    const res = await fetch(`/api/comments/${commentId}`)

    if (res.ok) {
        const comment = await res.json();
        dispatch(loadComments(comment))
        return comment
    }
}

// load all comments by a specific user
export const loadUserCommentsThunk = (userId) => async (dispatch) => {
    const res = await fetch(`/api/users/${userId}/comments`)

    const comments = await res.json()
    return dispatch(loadComments(comments))
}

// load all comments made by current user
export const loadCurrentUserCommentsThunk = () => async (dispatch) => {
    const res = await fetch(`/api/users/current/comments`)

    const data = await res.json()
    return dispatch(loadComments(data))
}

// load all comments for a specific post
export const loadPostCommentsThunk = (postId) => async (dispatch) => {
    const res = await fetch(`/api/posts/${postId}/comments`)

    const comments = await res.json()
    return dispatch(loadComments(comments))

}

// create a new comment for a post
export const createCommentThunk = (commentInfo, postId) => async (dispatch) => {
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
export const createReplyThunk = (commentInfo, commentId) => async (dispatch) => {
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

    if (res.ok) {
        const data = await res.json();
        dispatch(updateComment(data))
    } else if (res.status < 500) {
        const data = await res.json()
        if (data.errors) {
            return data.errors
        }
    }

    return null
}


// delete a comment
export const deleteCommentThunk = (comment) => async (dispatch) => {
    const res = await fetch(`/api/comments/${comment.id}`, {
        method: "DELETE"
    })

    if (res.ok) {
        dispatch(deleteComment(comment.id))
    }

    return null
}


// ------------------------- SELECTOR FUNCTIONS ------------------------- //

export const loadAllComments = (state) => state.comments;



// ------------------------------ REDUCERS ------------------------------ //

const initialState = {
    commentsById: [],
    comments: {},
    errors: []
};

const commentReducer = (state = initialState, action) => {
    const newState = { ...state };
    const errorCheck = reduxError(newState, action.payload)

    switch (action.type) {
        case LOAD_COMMENT:
            if (errorCheck) return errorCheck
            newState.errors = []
            newState.commentsById = [action.payload.id]
            newState.comments = action.payload

            return newState
        case LOAD_COMMENTS:
            if (errorCheck) return errorCheck
            newState.errors = []
            newState.commentsById = action.payload.comments_by_id
            newState.comments = action.payload.all_comments

            return newState
        case LOAD_CURR_COMMENTS:
            return 
        case CREATE_COMMENT:
            if (errorCheck) return errorCheck
            newState.errors = []

            return newState
        case PUT_COMMENT:
            if (errorCheck) return errorCheck
            newState.errors = []
            newState.comments[action.payload.id] = action.payload

            return newState
        case DELETE_COMMENT:
            if (errorCheck) return errorCheck
            newState.errors = []

            const deletedCommentId = newState.commentsById.filter(el => el !== action.payload.id)
            newState.commentsById = deletedCommentId
            delete newState[action.payload.id]
            return newState
        default:
            return newState
    }
}

export default commentReducer
