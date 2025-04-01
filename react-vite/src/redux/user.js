// ------------------------------- ACTIONS ------------------------------- //
const LOAD_USERS = "LOAD_USERS";
const DELETE_USER = "DELETE_USER";
const ERROR_USER = "ERROR_USER";

const loadUsers = (users) => {
	return {
		type: LOAD_USERS,
		payload: users,
	};
};

const deleteUser = (user) => {
	return {
		type: DELETE_USER,
		payload: user,
	};
};

const errorUser = (errors) => {
	return {
		type: ERROR_USER,
		payload: errors,
	};
};

// ------------------------------- THUNKS ------------------------------- //
// load all users
export const loadAllUserThunk = () => async () => {
	const res = await fetch("/api/users/");

	const data = await res.json();
	if (res.ok) return dispatch(loadUsers(data));
	return dispatch(errorUser(data));
};

// load current user
export const loadCurrentUserThunk = () => async () => {
	const res = await fetch("/api/users/current");

	const data = await res.json();
	if (res.ok) return dispatch(loadUsers(data));
	return dispatch(errorUser(data));
};

// load a specific user
export const loadUserThunk = (userId) => async () => {
	const res = await fetch(`/api/users/${userId}`);

	const data = await res.json();
	if (res.ok) return dispatch(loadUsers(data));
	return dispatch(errorUser(data));
};

// load a subreddit's users
export const loadSubredditUsersThunk = (subredditId) => async () => {
	const res = await fetch(`/api/subreddits/${subredditId}/users`);

	const data = await res.json();
	if (res.ok) return dispatch(loadUsers(data));
	return dispatch(errorUser(data));
};

// delete user account
export const deleteUserThunk = () => async (dispatch) => {
	const res = await fetch("/api/users/current", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data = await res.json();
	if (res.ok) return dispatch(deleteUser(data));
	return dispatch(errorUser(data));
};

// ------------------------------ REDUCERS ------------------------------ //
const userState = {
	usersById: [],
	users: {},
};

const userReducer = (state = userState, action) => {
	const newState = { ...state };

	// gets the id that would be returned from a single user query
	// const userId = action.payload && "users_by_id" in action.payload ? action.payload.users_by_id[0] : null;

	switch (action.type) {
		case LOAD_USERS:
			newState.users = action.payload.all_users;
			newState.usersById = action.payload.users_by_id;
			return newState;
		case DELETE_USER:
			newState.usersById = newState.usersById.filter((el) => el !== action.payload.id);
			delete newState.users[action.payload.id];
			return newState;
		case ERROR_USER:
			return newState;
		default:
			return newState;
	}
};

export default userReducer;
