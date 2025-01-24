// ------------------------------- ACTIONS ------------------------------- //
const LOAD_SUBREDDIT = '/subreddits/LOAD_SUBREDDIT'
const LOAD_SUBREDDITS = '/subreddits/LOAD_SUBREDDITS'
const PUT_SUBREDDIT = '/subreddits/PUT_SUBREDDIT'
const CREATE_SUBREDDIT = '/subreddits/CREATE_SUBREDDIT'
const DELETE_SUBREDDIT = '/subreddits/DELETE_SUBREDDIT'

export const loadSubreddit = (subreddit) => {
    return {
        type: LOAD_SUBREDDIT,
        payload: subreddit
    }
}

// Get subreddit
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

// Thunk action to load a specific subreddit
export const loadSubredditThunk = (subredditId) => async (dispatch) => {
    const res = await fetch(`/api/subreddits/${subredditId}`)

    const subreddit = await res.json()
    return dispatch(loadSubreddit(subreddit))
}

// Thunk action to load all subreddits
export const loadSubredditsThunk = () => async (dispatch) => {
    const res = await fetch("/api/subreddits")

    const subreddits = await res.json();
    dispatch(loadSubreddits(subreddits))
    return subreddits

}

// TO DO: Get Subreddits based on number of members?
// export const loadPopularSubredditsThunk = () => async (dispatch) => {
//     const res = await fetch ("/api/subreddits")
// }

// Thunk action to create subreddit
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


// Thunk action to edit subreddit (currently only updates description)
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


// Thunk action to delete subreddit
export const deleteSubredditThunk = (subredditId) => async (dispatch) => {
    const res = await fetch(`/api/subreddits/${subredditId}`, {
        method: "DELETE",
    })

    const data = await res.json()
    dispatch(deleteSubreddit(data))
}


// ------------------------- SELECTOR FUNCTIONS ------------------------- //

// export const loadAllSubreddit = (state) => state.subreddits

// ------------------------------ REDUCERS ------------------------------ //

const initialState = {
    subredditsById: [],
    subreddits: {},
    errors: []
};

const subredditReducer = (state = initialState, action) => {
    const newState = { ...state }

    if (action.payload && "errors" in action.payload) {
        newState.errors = action.payload.errors
        return newState
    } else if (action.payload && !("errors" in action.payload)) {
        newState.errors = []
    }

    switch (action.type) {
        case LOAD_SUBREDDIT:

            newState.subredditsById = [action.payload.id]
            newState.subreddits = action.payload

            return newState
        case LOAD_SUBREDDITS:
            newState.subredditsById = action.payload.subreddit_by_id
            newState.subreddits = action.payload.all_subreddits

            return newState

        case CREATE_SUBREDDIT:
            newState.subredditsById.push(action.payload.id)
            newState.subreddits[action.payload.id] = action.payload
            return newState

        case PUT_SUBREDDIT:
            newState.subreddits[action.payload.id] = action.payload
            return newState

        case DELETE_SUBREDDIT:
            const deleteSubredditId = newState.subredditsById.filter(el => el !== action.payload.id)
            newState.subredditsById = deleteSubredditId
            delete newState[action.payload.id]

            return newState
        default:
            return newState;
    }
}

export default subredditReducer;
