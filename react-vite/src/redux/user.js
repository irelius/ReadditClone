import { reduxError } from "./helper";

const LOAD_USERS = "LOAD_USERS"
const DELETE_USER = "DELETE_USER"

const loadUsers = (users) => ({
    type: LOAD_USERS,
    payload: users
})

const deleteUser = (user) => ({
    type: DELETE_USER,
    payload: user
})

// ------------------------------- THUNKS ------------------------------- //
// load all users
export const loadAllUserThunk = () => async () => {
    const res = await fetch('/api/users/')
    const data = await res.json()
    return dispatch(loadUsers(data))
}

// load current user
export const loadCurrentUserThunk = () => async () => {
    const res = await fetch("/api/users/current")
    const data = await res.json()
    return dispatch(loadUsers(data))
}

// load a specific user
export const loadUserThunk = (userId) => async () => {
    const res = await fetch(`/api/users/${userId}`)
    const data = await res.json()
    return dispatch(loadUsers(data))
}

// load a subreddit's users
export const loadSubredditUsersThunk = (subredditId) => async () => {
    const res = await fetch(`/api/subreddits/${subredditId}/users`)
    const data = await res.json()
    return dispatch(loadUsers(data))
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

    // gets the id that would be returned from a single user query
    const userId = action.payload && "users_by_id" in action.payload ? action.payload.users_by_id[0] : null

    switch (action.type) {
        case LOAD_USERS:
            if (errorCheck) return errorCheck
            newState.errors = []

            newState.users = action.payload.all_users
            newState.usersById = action.payload.users_by_id

            return newState
        case DELETE_USER:
            if (errorCheck) return errorCheck
            newState.errors = []

            newState.usersById = newState.usersById.filter(el => el !== userId)
            delete newState[userId]
            return newState
        default:
            return newState
    }
}

export default userReducer