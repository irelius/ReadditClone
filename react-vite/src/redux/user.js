import { reduxError } from "./helper";

const LOAD_USER = "LOAD_USER"
const LOAD_USERS = "LOAD_USERS"
const DELETE_USER = "DELETE_USER"

const loadUser = (user) => ({
    type: LOAD_USER,
    payload: user
})

const loadUsers = (users) => ({
    type: LOAD_USERS,
    payload: users
})

const deleteUser = (user) => ({
    type: DELETE_USER,
    payload: user
})


// ------------------------------- THUNKS ------------------------------- //
// load a specific user
export const loadUserThunk = (userId) => async (dispatch) => {
    const res = await fetch(`/api/users/${userId}`)

    const data = await res.json()
    return dispatch(loadUser(data))
}

// load current user
export const loadCurrentUserThunk = () => async (dispatch) => {
    const res = await fetch("/api/users/current")
    const data = await res.json()
    return dispatch(loadUser(data))
}

// load all users
export const loadAllUserThunk = () => async (dispatch) => {
    const res = await fetch('/api/users/')

    const users = await res.json()
    return dispatch(loadUsers(users))
}

// load a subreddit's users
export const loadSubredditUsersThunk = (subredditId) => async (dispatch) => {
    const res = await fetch(`/api/subreddits/${subredditId}/users`)

    const users = await res.json()
    return dispatch(loadUsers(users))
}

// delete user account
export const deleteUserThunk = () => async (dispatch) => {
    const res = await fetch('/api/users/current', {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        }
    })

    const data = await res.json()
    dispatch(deleteUser(data))
}

// ------------------------------ REDUCERS ------------------------------ //
const userState = {
    usersById: [],
    users: {},
    errors: []
}

const userReducer = (state = userState, action) => {
    const newState = { ...state }
    const errorCheck = reduxError(newState, action.payload)

    switch (action.type) {
        case LOAD_USER:
            if (errorCheck) return errorCheck
            newState.errors = []

            return newState
        case LOAD_USERS:
            if (errorCheck) return errorCheck
            newState.errors = []

            newState.users = action.payload.all_user
            newState.usersById = action.payload.user_by_id
            return newState

        case DELETE_USER:
            if (errorCheck) return errorCheck
            newState.errors = []

            const deletedUserId = newState.usersById.filter(el => el !== action.payload.id)
            newState.usersById = deletedUserId
            delete newState[action.payload.id]
            return newState
        default:
            return newState
    }
}

export default userReducer