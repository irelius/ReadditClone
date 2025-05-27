// ------------------------------- ACTIONS ------------------------------- //
const LOAD_SUBREDDITS = "LOAD_SUBREDDITS";
const UPDATE_SUBREDDIT = "PUT_SUBREDDIT";
const CREATE_SUBREDDIT = "CREATE_SUBREDDIT";
const DELETE_SUBREDDIT = "DELETE_SUBREDDIT";
const ERROR_SUBREDDIT = "ERROR_SUBREDDIT";

export const loadSubreddits = (subreddits) => {
	return {
		type: LOAD_SUBREDDITS,
		payload: subreddits,
	};
};

export const createSubreddit = (subreddit) => {
	return {
		type: CREATE_SUBREDDIT,
		payload: subreddit,
	};
};

export const updateSubreddit = (subreddit) => {
	return {
		type: UPDATE_SUBREDDIT,
		payload: subreddit,
	};
};

export const deleteSubreddit = (subreddit) => {
	return {
		type: DELETE_SUBREDDIT,
		payload: subreddit,
	};
};

export const errorSubreddit = (errors) => {
	return {
		type: ERROR_SUBREDDIT,
		payload: errors,
	};
};

// ------------------------------- THUNKS ------------------------------- //
// load all subreddits
export const loadSubredditsThunk = () => async (dispatch) => {
	const res = await fetch("/api/subreddits/");
	const data = await res.json();
	if (res.ok) return dispatch(loadSubreddits(data));
	return dispatch(errorSubreddit(data));
};

// load a specific subreddit
export const loadSubredditThunk = (subredditId) => async (dispatch) => {
	const res = await fetch(`/api/subreddits/${subredditId}`);
	const data = await res.json();
	if (res.ok) return dispatch(loadSubreddits(data));
	return dispatch(errorSubreddit(data));
};

// load a specific user's subreddits
export const loadUserSubredditThunk = (userId) => async (dispatch) => {
	const res = await fetch(`/api/users/${userId}/subreddits`);
	const data = await res.json();
	if (res.ok) return dispatch(loadSubreddits(data));
	return dispatch(errorSubreddit(data));
};

// load current user's subreddits
export const loadCurrentUserSubredditThunk = () => async (dispatch) => {
	const res = await fetch(`/api/users/current/subreddits`);
	const data = await res.json();
	if (res.ok) return dispatch(loadSubreddits(data));
	return dispatch(errorSubreddit(data));
};

// create subreddit
export const createSubredditThunk =
	({ name, description }) =>
	async (dispatch) => {
		const res = await fetch(`/api/subreddits/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name,
				description,
			}),
		});

		const data = await res.json();
		if (res.ok) return dispatch(createSubreddit(data));
		return dispatch(errorSubreddit(data));
	};

// edit subreddit (currently only updates description)
// TO DO: think of more properties of subreddits that could be changed (e.g. privacy, banner, etc.)
export const updateSubredditThunk =
	({ subredditId, name, description }) =>
	async (dispatch) => {
		const res = await fetch(`/api/subreddits/${subredditId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name,
				description,
			}),
		});

		const data = await res.json();
		if (res.ok) return dispatch(updateSubreddit(data));
		return dispatch(errorSubreddit(data));
	};

// user joins subreddit as a member
export const userJoinSubredditThunk = (subredditId) => async (dispatch) => {
	const res = await fetch(`/api/subreddits/${subredditId}/join`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	});

	// TODO see how to update the state in the reducer for this thunk
	const data = await res.json();
	if (res.ok) return dispatch(loadSubreddits(data));
	return dispatch(errorSubreddit(data));
};

// user leaves subreddit
export const userLeaveSubredditThunk = (subredditId) => async (dispatch) => {
	const res = await fetch(`/api/subreddits/${subredditId}/leave`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data = await res.json();
	if (res.ok) return dispatch(loadSubreddits(data));
	return dispatch(errorSubreddit(data));
};

// delete subreddit
export const deleteSubredditThunk = (subredditId) => async (dispatch) => {
	const res = await fetch(`/api/subreddits/${subredditId}`, {
		method: "DELETE",
	});

	const data = await res.json();
	if (res.ok) return dispatch(deleteSubreddit(data));
	return dispatch(errorSubreddit(data));
};

// ------------------------------ REDUCERS ------------------------------ //

const subredditState = {
	subredditsById: [],
	subreddits: {},
};

const subredditReducer = (state = subredditState, action) => {
	const newState = { ...state };

	// gets the id that would be returned from a single subreddit query
	const subredditId =
		action.payload && "subreddits_by_id" in action.payload ? action.payload.subreddits_by_id[0] : null;

	switch (action.type) {
		case LOAD_SUBREDDITS:
			newState.subredditsById = action.payload.subreddits_by_id;
			newState.subreddits = action.payload.all_subreddits;
			return newState;
		case CREATE_SUBREDDIT:
			newState.subredditsById = [subredditId];
			newState.subreddits = action.payload.all_subreddits;

			return newState;
		case UPDATE_SUBREDDIT:
			newState.subredditsById = [subredditId];
			newState.subreddits = action.payload.all_subreddits;

			return newState;
		case DELETE_SUBREDDIT:
			newState.subredditsById = newState.subredditsById.filter((el) => el !== action.payload.id);
			delete newState.subreddits[action.payload.id];
			return newState;
		case ERROR_SUBREDDIT:
			return newState;
		default:
			return newState;
	}
};

export default subredditReducer;
