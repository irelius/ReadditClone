import { reduxError } from "./helper"

// ------------------------------- ACTIONS ------------------------------- //
const LOAD_SUBREDDIT = 'LOAD_SUBREDDIT'
const LOAD_SUBREDDITS = 'LOAD_SUBREDDITS'
const PUT_SUBREDDIT = 'PUT_SUBREDDIT'
const CREATE_SUBREDDIT = 'CREATE_SUBREDDIT'
const DELETE_SUBREDDIT = 'DELETE_SUBREDDIT'

export const loadSubreddit = (subreddit) => {
    return {
        type: LOAD_SUBREDDIT,
        payload: subreddit
    }
}

export const loadSubreddits = (subreddits) => {
    return {
        type: LOAD_SUBREDDITS,
        payload: subreddits
    }
}

export const createSubreddit = (subreddit) => {
    return {
        type: CREATE_SUBREDDIT,
        payload: subreddit
    }
}

export const updateSubreddit = (subreddit) => {
    return {
        type: PUT_SUBREDDIT,
        payload: subreddit
    }
}

export const deleteSubreddit = (subreddit) => {
    return {
        type: DELETE_SUBREDDIT,
        payload: subreddit
    }
}

// ------------------------------- THUNKS ------------------------------- //

// load a specific subreddit
export const loadSubredditThunk = (subredditId) => async (dispatch) => {
    const res = await fetch(`/api/subreddits/${subredditId}`)

    const subreddit = await res.json()
    return dispatch(loadSubreddit(subreddit))
}

// load all subreddits
export const loadSubredditsThunk = () => async (dispatch) => {
    const res = await fetch("/api/subreddits/")

    const data = await res.json();
    return dispatch(loadSubreddits(data))
}

// load a user's subreddits
export const loadUserSubredditThunk = (userId) => async (dispatch) => {
    const res = await fetch(`/api/users/${userId}/subreddits`)

    const data = await res.json()
    return dispatch(loadSubreddits(data))
}

// create subreddit
export const createSubredditThunk = ({ name, description }) => async (dispatch) => {
    const res = await fetch(`/api/subreddits/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            description
        }),
    })

    const data = await res.json();
    dispatch(createSubreddit(data))
}

// user joins subreddit as a member
export const userJoinSubredditThunk = (subredditId) => async (dispatch) => {
    const res = await fetch(`/api/subreddits/${subredditId}/join`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }
    })

    const data = await res.json()
    // TODO see how to update the state in the reducer for this thunk
    console.log('booba', data)

}

// edit subreddit (currently only updates description)
// TO DO: think of more properties of subreddits that could be changed (e.g. privacy, banner, etc.)
export const updateSubredditThunk = ({ subredditId, description }) => async (dispatch) => {
    const res = await fetch(`/api/subreddits/${subredditId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            description
        }),
    })

    const data = await res.json();
    dispatch(updateSubreddit(data))
}


// user leaves subreddit
export const userLeaveSubredditThunk = (subredditId) => async (dispatch) => {
    const res = await fetch(`/api/subreddits/${subredditId}/leave`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        }
    })

    const data = await res.json()
    // TODO see how to update the state in the reducer for this thunk
    console.log('booba', data)
}

// delete subreddit
export const deleteSubredditThunk = (subredditId) => async (dispatch) => {
    const res = await fetch(`/api/subreddits/${subredditId}`, {
        method: "DELETE",
    })

    const data = await res.json()
    dispatch(deleteSubreddit(data))
}


// ------------------------------ REDUCERS ------------------------------ //

const subredditState = {
    subredditsById: [],
    subreddits: {},
    errors: []
};

const subredditReducer = (state = subredditState, action) => {
    const newState = { ...state }

    const errorCheck = reduxError(newState, action.payload)

    switch (action.type) {
        case LOAD_SUBREDDIT:
            if (errorCheck) return errorCheck

            newState.errors = []
            newState.subredditsById = [action.payload.id]
            newState.subreddits[action.payload.id] = action.payload

            return newState
        case LOAD_SUBREDDITS:
            if (errorCheck) return errorCheck

            newState.errors = []
            newState.subredditsById = action.payload.subreddit_by_id
            newState.subreddits = action.payload.all_subreddits

            return newState
        case CREATE_SUBREDDIT:
            if (errorCheck) return errorCheck

            newState.errors = []
            newState.subredditsById.push(action.payload.id)
            newState.subreddits[action.payload.id] = action.payload

            return newState
        case PUT_SUBREDDIT:
            if (errorCheck) return errorCheck

            newState.errors = []
            newState.subreddits[action.payload.id] = action.payload

            return newState
        case DELETE_SUBREDDIT:
            if (errorCheck) return errorCheck

            newState.errors = []
            const deleteSubredditId = newState.subredditsById.filter(el => el !== action.payload.id)
            newState.subredditsById = deleteSubredditId
            delete newState[action.payload.id]

            return newState
        default:
            return newState;
    }
}

export default subredditReducer;
