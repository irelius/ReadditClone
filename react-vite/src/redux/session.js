import { reduxError } from "./helper";

// constants
const SET_USER = 'SET_USER';
const LOGOUT_USER = 'LOGOUT_USER';

const setUser = (user) => ({
    type: SET_USER,
    payload: user
});

const logoutUser = () => ({
    type: LOGOUT_USER,
})


// ------------------------------- THUNKS ------------------------------- //
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
        dispatch(logoutUser());
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


// ------------------------------ REDUCERS ------------------------------ //
const sessionState = {
    loggedIn: false,
    user: null,
    errors: []
}

const sessionReducer = (state = sessionState, action) => {
    const newState = { ...state }
    const errorCheck = reduxError(newState, action.payload)

    switch (action.type) {
        case SET_USER:
            if (errorCheck) return errorCheck
            newState.errors = []
            newState.loggedIn = true
            newState.user = { ...action.payload }

            return newState
        case LOGOUT_USER:
            if (errorCheck) return errorCheck
            return state
        default:
            return state;
    }
}

export default sessionReducer
