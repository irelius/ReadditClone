// ------------------------------- ACTIONS ------------------------------- //
const LOAD_COMMENT_LIKES = "LOAD_COMMENT_LIKES";
const CREATE_COMMENT_LIKE = "CREATE_COMMENT_LIKE";
const UPDATE_COMMENT_LIKE = "UPDATE_COMMENT_LIKE";
const DELETE_COMMENT_LIKE = "DELETE_COMMENT_LIKE";
const ERROR_COMMENT_LIKES = "ERROR_COMMENT_LIKES";

// Get likes for a comment
export const loadCommentLikes = (likes) => {
	return {
		type: LOAD_COMMENT_LIKES,
		payload: likes,
	};
};

// handle when user clicks on like/dislike for comments
export const handleCommentLikes = (commentId, type) => {
	return {
		type: `${type}_COMMENT_LIKE`,
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

// // load all likes/dislikes for a commment
// export const loadCommentLikesThunk = (commentId) => async (dispatch) => {
// 	const res = await fetch(`/api/comments/${commentId}/likes`);
// 	const data = await res.json();
// 	if (res.ok) return dispatch(loadCommentLikes(data));
// 	return dispatch(errorCommentLike(data));
// };

// load like status for one comment made by current user
export const loadCurrentUserOneCommentLikesThunk = (commentId) => async (dispatch) => {
	const res = await fetch(`/api/users/current/comments/${commentId}/likes`);
	const data = await res.json();
	if (res.ok) return dispatch(loadCommentLikes(data));
	return dispatch(errorCommentLike(data));
};

// load all comments likes on a specific post by current user
export const loadCurrentUserOnePostCommentLikesThunk = (postId) => async (dispatch) => {
    const res = await fetch(`/api/users/current/posts/${postId}/comments/likes`)
    const data = await res.json()
    if (res.ok) return dispatch(loadCommentLikes(data))
    return dispatch(errorCommentLike(data))
}

// load all comment likes for all comments made by current user
export const loadCurrentUserAllCommentsLikesThunk = () => async (dispatch) => {
	const res = await fetch(`/api/users/current/comment_likes`);
	const data = await res.json();
	if (res.ok) return dispatch(loadCommentLikes(data));
	return dispatch(errorCommentLike(data));
};

// load all comment likes made by a specific user
export const loadUserCommentLikesThunk = (userId) => async (dispatch) => {
	const res = await fetch(`/api/users/${userId}/comment_likes`);
	const data = await res.json();
	if (res.ok) return dispatch(loadCommentLikes(data));
	return dispatch(errorCommentLike(data));
};


// handle comment like by current user
export const handleCommentLikesThunk = (likeInfo, commentId, postId) => async (dispatch) => {
	const res = await fetch(`/api/comments/${commentId}/likes`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ like_status: likeInfo, post_id: postId }),
	});

	const data = await res.json();
	if (res.ok) {
		dispatch(handleCommentLikes(data));
		return data;
	}
	dispatch(errorCommentLike(data));
	return null;
};

// ------------------------------ REDUCERS ------------------------------ //

const initialState = {
	likedCommentsById: [],
	likedComments: {},
};

const commentLikesReducer = (state = initialState, action) => {
	const newState = { ...state };

	// gets the id that would be returned from a single post query
	const commentLikeId =
		action.payload && "liked_comments_by_id" in action.payload ? action.payload.liked_comments_by_id[0] : null;

	switch (action.type) {
		case LOAD_COMMENT_LIKES:
			newState.likedCommentsById = action.payload.liked_comments_by_id;
			newState.likedComments = action.payload.liked_comments;
			return newState;
		// case HANDLE_COMMENT_LIKES:
		// 	newState.likedCommentsById.push(commentLikeId);
		// 	newState.likedComments[commentLikeId] = action.payload.liked_comments;
		// 	return newState;

        case CREATE_COMMENT_LIKE:
			newState.likedCommentsById.push(commentLikeId);
			newState.likedComments[commentLikeId] = action.payload.liked_comments[commentLikeId];
			newState.likedCommentsById.push(commentLikeId);
			newState.likedComments[commentLikeId] = action.payload.liked_comments[commentLikeId];
			return newState;
		case UPDATE_COMMENT_LIKE:
			newState.likedComments[commentLikeId] = action.payload.liked_comments[commentLikeId];
			newState.likedComments[commentLikeId] = action.payload.liked_comments[commentLikeId];
			return newState;
		case DELETE_COMMENT_LIKE:
			newState.likedCommentsById = newState.likedCommentsById.filter((el) => el !== action.payload.id);
			newState.likedCommentsById = newState.likedCommentsById.filter((el) => el !== action.payload.id);
			delete newState.likedComments[commentLikeId];
			delete newState.likedComments[commentLikeId];
			return newState;
		case ERROR_COMMENT_LIKES:
			return newState;
		default:
			return newState;
	}
};

export default commentLikesReducer;
