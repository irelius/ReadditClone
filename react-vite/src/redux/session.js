// constants
const LOAD_SESSION = "LOAD_SESSION";
const DELETE_SESSION = "DELETE_SESSION";
const ERROR_SESSION = "ERROR_SESSION";

const loadSession = (user) => {
	return {
		type: LOAD_SESSION,
		payload: user,
	};
};

const deleteSession = (user) => {
	return {
		type: DELETE_SESSION,
		payload: user,
	};
};

const errorSession = (errors) => {
	return {
		type: ERROR_SESSION,
		payload: errors,
	};
};

// ------------------------------- THUNKS ------------------------------- //
export const authenticate = () => async (dispatch) => {
	const res = await fetch("/api/auth/", {
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data = await res.json();
	if (res.ok) return dispatch(loadSession(data));
	return dispatch(errorSession(data));
};

export const login =
	({ email, password }) =>
	async (dispatch) => {
		const res = await fetch("/api/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email,
				password,
			}),
		});
		const data = await res.json();
		if (res.ok) return dispatch(loadSession(data));
		return dispatch(errorSession(data));
	};

export const logout = () => async (dispatch) => {
	const res = await fetch("/api/auth/logout", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data = await res.json();
	if (res.ok) return dispatch(deleteSession(data));
	return dispatch(errorSession(data));
};

export const signUp =
	({ username, email, password }) =>
	async (dispatch) => {
		const res = await fetch("/api/auth/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
				email,
				password,
			}),
		});

		const data = await res.json();
		if (res.ok) return dispatch(loadSession(data));
		return dispatch(errorSession(data));
	};

// ------------------------------ REDUCERS ------------------------------ //
const sessionState = {
	loggedIn: false,
	user: null,
};

const sessionReducer = (state = sessionState, action) => {
	const newState = { ...state };

	switch (action.type) {
		case LOAD_SESSION:
			newState.loggedIn = true;
			newState.user = { ...action.payload };
			return newState;
		case DELETE_SESSION:
			newState.loggedIn = false;
			newState.user = null;
			return newState;
		case ERROR_SESSION:
			return newState;
		default:
			return state;
	}
};

export default sessionReducer;
