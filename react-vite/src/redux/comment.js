// ------------------------------- ACTIONS ------------------------------- //
const LOAD_COMMENTS = "LOAD_COMMENTS";
const CREATE_COMMENT = "CREATE_COMMENT";
const PUT_COMMENT = "PUT_COMMENT";
const DELETE_COMMENT = "DELETE_COMMENT";
const ERROR_COMMENT = "ERROR_COMMENT";

// Get comments
export const loadComments = (comments) => {
	return {
		type: LOAD_COMMENTS,
		payload: comments,
	};
};

// Create a new comment
export const createComment = (comment) => {
	return {
		type: CREATE_COMMENT,
		payload: comment,
	};
};

// Update a comment
export const updateComment = (comment) => {
	return {
		type: PUT_COMMENT,
		payload: comment,
	};
};

// Delete a comment
export const deleteComment = (comment) => {
	return {
		type: DELETE_COMMENT,
		payload: comment,
	};
};

// Load store with errors
export const errorComment = (errors) => {
	return {
		type: ERROR_COMMENT,
		payload: errors,
	};
};

// ------------------------------- THUNKS ------------------------------- //

// load all comments
export const loadCommentsThunk = () => async (dispatch) => {
	const res = await fetch(`/api/comments/`);

	const data = await res.json();
	if (res.ok) return dispatch(loadComments(data));
	return dispatch(errorComment(data));
};

// load one comment
export const loadCommentThunk = (commentId) => async (dispatch) => {
	const res = await fetch(`/api/comments/${commentId}`);
	const data = await res.json();
	if (res.ok) return dispatch(loadComments(data));
	return dispatch(errorComment(data));
};

// load all comments by a specific user
export const loadUserCommentsThunk = (userId) => async (dispatch) => {
	const res = await fetch(`/api/users/${userId}/comments`);
	const data = await res.json();
	if (res.ok) return dispatch(loadComments(data));
	return dispatch(errorComment(data));
};

// load all comments made by current user
export const loadCurrentUserCommentsThunk = () => async (dispatch) => {
	const res = await fetch(`/api/users/current/comments`);
	const data = await res.json();
	if (res.ok) return dispatch(loadComments(data));
	return dispatch(errorComment(data));
};

// load all comments for a specific post
export const loadPostCommentsThunk = (postId) => async (dispatch) => {
	const res = await fetch(`/api/posts/${postId}/comments`);
	const data = await res.json();
	if (res.ok) return dispatch(loadComments(data));
	return dispatch(errorComment(data));
};

// create a new comment on a post
export const createCommentOnPostThunk = (commentInfo, postId) => async (dispatch) => {
	const res = await fetch(`/api/posts/${postId}/comments`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(commentInfo),
	});

	const data = await res.json();
	if (res.ok) return dispatch(createComment(data));
	return dispatch(errorComment(data));
};

// create a new comment as a reply to another comment
export const createCommentOnCommentThunk = (commentInfo, commentId) => async (dispatch) => {
	const res = await fetch(`/api/comments/${commentId}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(commentInfo),
	});

	const data = await res.json();
	if (res.ok) return dispatch(createComment(data));
	return dispatch(errorComment(data));
};

// update a comment
export const updateCommentThunk = (commentInfo, commentId) => async (dispatch) => {
	const res = await fetch(`/api/comments/${commentId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(commentInfo),
	});

	const data = await res.json();
	if (res.ok) return dispatch(updateComment(data));
	return dispatch(errorComment(data));
};

// delete a comment
export const deleteCommentThunk = (commentId) => async (dispatch) => {
	const res = await fetch(`/api/comments/${commentId}`, {
		method: "DELETE",
	});

	const data = await res.json();
	if (res.ok) return dispatch(deleteComment(data));
	return dispatch(errorComment(data));
};

// ------------------------------ REDUCERS ------------------------------ //
const initialState = {
	commentsById: [],
	comments: {},
};

const commentReducer = (state = initialState, action) => {
	const newState = { ...state };
	// gets the id that would be returned from a single comment query
	const commentId = action.payload && "comments_by_id" in action.payload ? action.payload.comments_by_id[0] : null;

	switch (action.type) {
		case LOAD_COMMENTS:
			newState.commentsById = action.payload.comments_by_id;
			newState.comments = action.payload.all_comments;
			return newState;
		case CREATE_COMMENT:
			newState.commentsById.push(commentId);
			newState.comments[commentId] = action.payload.all_comments;
			return newState;
		case PUT_COMMENT:
			newState.comments[commentId] = action.payload.all_comments;
			return newState;
		case DELETE_COMMENT:
			newState.commentsById = newState.commentsById.filter((el) => el !== action.payload.id);
			delete newState.comments[action.payload.id];
			return newState;
		case ERROR_COMMENT:
			// if (errorType.includes("comment") && !newState.errors.includes(errorMessage)) {
			//     newState.errors = [errorMessage];
			// }
			return newState;
		default:
			return newState;
	}
};

export default commentReducer;
