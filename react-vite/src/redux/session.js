// constants
const SET_USER = 'session/SET_USER';
const REMOVE_USER = 'session/REMOVE_USER';
const LOAD_USERS = "session/LOAD_USERS"

const setUser = (user) => ({
    type: SET_USER,
    payload: user
});

const removeUser = () => ({
    type: REMOVE_USER,
})

const loadUsers = (users) => ({
    type: LOAD_USERS,
    payload: users
})

export const authenticate = () => async (dispatch) => {
    const response = await fetch('/api/auth/', {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(setUser(data));
    }
}

export const login = ({ email, password }) => async (dispatch) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    });
    const data = await response.json();
    return dispatch(setUser(data))
}

export const logout = () => async (dispatch) => {
    const response = await fetch('/api/auth/logout', {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (response.ok) {
        dispatch(removeUser());
    }
};


export const signUp = ({ username, email, password }) => async (dispatch) => {
    const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            email,
            password
        }),
    });

    const data = await response.json();
    dispatch(setUser(data))

}

export const loadAllUserThunk = () => async (dispatch) => {
    const res = await fetch('/api/users/')

    if (res.ok) {
        const users = await res.json()
        dispatch(loadUsers(users))
        return users
    }
}

// ------------------------- SELECTOR FUNCTIONS ------------------------- //

export const loadAllUsers = (state) => state.session

const initialState = {
    loggedIn: false,
    user: null,
    errors: []
}

// ------------------------------ REDUCERS ------------------------------ //


const sessionReducer = (state = initialState, action) => {
    const newState = { ...state }

    if (action.payload && "errors" in action.payload) {
        newState.errors = action.payload.errors
        return newState
    } else if (action.payload && !("errors" in action.payload)) {
        newState.errors = []
    }

    // reduxError(newState, action.payload)

    switch (action.type) {
        case SET_USER:
            newState.loggedIn = true
            newState.user = { ...action.payload }
            return newState
        case LOAD_USERS:
            const userById = []
            const users = {}

            for (let i = 0; i < action.payload.users.length; i++) {
                let currUser = action.payload.users[i]
                users[currUser.id] = currUser
                userById.push(currUser.id)
            }

            return {
                userById,
                users
            }

        case REMOVE_USER:
            return initialState
        default:
            return state;
    }
}

export default sessionReducer
