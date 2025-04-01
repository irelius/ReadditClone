// ------------------------------- ACTIONS ------------------------------- //
const LOAD_COMMENT_LIKES = "LOAD_COMMENT_LIKES";
const CREATE_COMMENT_LIKES = "CREATE_COMMENT_LIKES";
// const PUT_COMMENT_LIKES = 'PUT_COMMENT_LIKES'
const DELETE_COMMENT_LIKES = "DELETE_COMMENT_LIKES";
const ERROR_COMMENT_LIKES = "ERROR_COMMENT_LIKES";

// Get likes for a comment
export const loadCommentLikes = (likes) => {
	return {
		type: LOAD_COMMENT_LIKES,
		payload: likes,
	};
};

// create likes for comment
export const createCommentLike = (commentId) => {
	return {
		type: CREATE_COMMENT_LIKES,
		payload: commentId,
	};
};

// // TODO: test if updating a like is viable
// export const putLikesComment = (commentId) => {
//     return {
//         type: PUT_COMMENT_LIKES,
//         commentId
//     }
// }

// delete like for a comment
export const deleteCommentLike = (commentId) => {
	return {
		type: DELETE_COMMENT_LIKES,
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
export const loadCommentLikesThunk = (commentId) => async () => {
	const res = await fetch(`/api/comments/${commentId}/likes`);
	const data = await res.json();
	if (res.ok) return dipatch(loadCommentLikes(res));
	return dispatch(errorCommentLike(data));
};

// load like status for a comment made by current user
export const loadCurrentUserCommentLikesThunk = (commentId) => async () => {
	const res = await fetch(`/api/users/current/comments/${commentId}/likes`);
	const data = await res.json();
	if (res.ok) return dipatch(loadCommentLikes(res));
	return dispatch(errorCommentLike(data));
};

// load all comment likes made by a specific user
export const loadUserCommentLikesThunk = (userId) => async () => {
	const res = await fetch(`/api/users/${userId}/comment_likes`);
	const data = await res.json();
	if (res.ok) return dipatch(loadCommentLikes(res));
	return dispatch(errorCommentLike(data));
};

export const createCommentLikesThunk = (likeInfo, commentId) => async (dispatch) => {
	// TODO
	const res = await fetch(`/api/comments/${commentId}/likes`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(likeInfo),
	});

	const data = await res.json();
	if (res.ok) return dispatch(createCommentLike(data));
	return dispatch(errorCommentLike(data));
};

// // TODO: test if updating a like is viable

export const deleteCommentLikesThunk = (commentId) => async (dispatch) => {
	const res = await fetch(`/api/comments/${commentId}/likes`, {
		method: "DELETE",
	});

	const data = await res.json();
	if (res.ok) return dispatch(deleteCommentLike(data));
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
		case CREATE_COMMENT_LIKES:
			newState.commentLikesById.push(commentLikeId);
			newState.commentLikes[commentLikeId] = action.payload.all_comment_likes;
			return newState;
		case DELETE_COMMENT_LIKES:
			newState.commentLikesById = newState.commentLikesById.filter(el !== action.payload.id);
			delete newState.commentLikes[action.payload.id];
			return newState;
        case ERROR_COMMENT_LIKES:
            return newState
		default:
			return newState;
	}
};

export default commentLikesReducer;
