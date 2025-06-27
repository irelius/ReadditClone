// ------------------------------- ACTIONS ------------------------------- //
const LOAD_COMMENT_LIKES = "LOAD_COMMENT_LIKES";
const HANDLE_COMMENT_LIKES = "HANDLE_COMMENT_LIKES";
// const DELETE_COMMENT_LIKES = "DELETE_COMMENT_LIKES";
const ERROR_COMMENT_LIKES = "ERROR_COMMENT_LIKES";

// Get likes for a comment
export const loadCommentLikes = (likes) => {
	return {
		type: LOAD_COMMENT_LIKES,
		payload: likes,
	};
};

// handle when user clicks on like/dislike for comments
export const handleCommentLikes = (commentId) => {
	return {
		type: HANDLE_COMMENT_LIKES,
		payload: commentId,
	};
};

export const errorCommentLike = (errors) => {
	return {
		type: ERROR_COMMENT_LIKES,
		payload: errors,
	};
};

// ------------------------------- THUNKS ------------------------------- //

// load all likes/dislikes for a commment
export const loadCommentLikesThunk = (commentId) => async (dispatch) => {
	const res = await fetch(`/api/comments/${commentId}/likes`);
	const data = await res.json();
	if (res.ok) return dispatch(loadCommentLikes(res));
	return dispatch(errorCommentLike(data));
};

// load like status for one comment made by current user
export const loadCurrentUserOneCommentLikesThunk = (commentId) => async (dispatch) => {
	const res = await fetch(`/api/users/current/comments/${commentId}/likes`);
	const data = await res.json();
	if (res.ok) return dispatch(loadCommentLikes(res));
	return dispatch(errorCommentLike(data));
};

// load all comment likes for all comments made by current user
export const loadCurrentUserAllCommentsLikesThunk = (userId) => async (dispatch) => {
	const res = await fetch(`/api/users/current/comment_likes`);
	const data = await res.json();
	if (res.ok) return dispatch(loadCommentLikes(res));
	return dispatch(errorCommentLike(data));
};

// load all comment likes made by a specific user
export const loadUserCommentLikesThunk = (userId) => async (dispatch) => {
	const res = await fetch(`/api/users/${userId}/comment_likes`);
	const data = await res.json();
	if (res.ok) return dispatch(loadCommentLikes(res));
	return dispatch(errorCommentLike(data));
};

export const handleCommentLikesThunk = (likeInfo, commentId) => async (dispatch) => {
	const res = await fetch(`/api/comments/${commentId}/likes`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(likeInfo),
	});

	const data = await res.json();
	if (res.ok) return dispatch(handleCommentLikes(data));
	return dispatch(errorCommentLike(data));
};

// ------------------------------ REDUCERS ------------------------------ //

const initialState = {
	commentLikesById: [],
	commentLikes: {},
};

const commentLikesReducer = (state = initialState, action) => {
	const newState = { ...state };

	// gets the id that would be returned from a single post query
	const commentLikeId =
		action.payload && "comment_likes_by_id" in action.payload ? action.payload.comment_likes_by_id[0] : null;

	switch (action.type) {
		case LOAD_COMMENT_LIKES:
			newState.commentLikesById = action.payload.comment_likes_by_id;
			newState.commentLikes = action.payload.all_comment_likes;
			return newState;
		case HANDLE_COMMENT_LIKES:
			newState.commentLikesById.push(commentLikeId);
			newState.commentLikes[commentLikeId] = action.payload.all_comment_likes;
			return newState;
		// case DELETE_COMMENT_LIKES:
		// 	newState.commentLikesById = newState.commentLikesById.filter(el !== action.payload.id);
		// 	delete newState.commentLikes[action.payload.id];
		// 	return newState;
        case ERROR_COMMENT_LIKES:
            return newState
		default:
			return newState;
	}
};

export default commentLikesReducer;
