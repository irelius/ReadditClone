// ------------------------------- ACTIONS ------------------------------- //
const LOAD_LIKED_POSTS = "LOAD_LIKED_POSTS";
const CREATE_POST_LIKE = "CREATE_POST_LIKE";
const UPDATE_POST_LIKE = "UPDATE_POST_LIKE";
const DELETE_POST_LIKE = "DELETE_POST_LIKE";
const ERROR_POST_LIKE = "ERROR_POST_LIKE";

// Get data for posts that have a like/dislike status
export const loadLikedPosts = (likes) => {
	return {
		type: LOAD_LIKED_POSTS,
		payload: likes,
	};
};

// handle when user clicks on like/dislike for posts
export const handlePostLikes = (postId, type) => {
	return {
		type: `${type}_POST_LIKE`,
		payload: postId,
	};
};

export const errorPostLike = (errors) => {
	return {
		type: ERROR_POST_LIKE,
		payload: errors,
	};
};

// ------------------------------- THUNKS ------------------------------- //
// // load likes status for a post
// export const loadLikesPostThunk = (postId) => async (dispatch) => {
// 	const res = await fetch(`/api/posts/${postId}/likes`);
// 	const data = await res.json();

// 	if (res.ok) {
// 		dispatch(loadLikedPosts(data));
// 		return data.total_likes;
// 	}
// 	return dispatch(errorPostLike);
// };

// Get like status of a specific post by current user
export const loadCurrentUserOnePostLikesThunk = (postId) => async (dispatch) => {
	const res = await fetch(`/api/users/current/posts/${postId}/likes`);
	const data = await res.json();
	if (res.ok) {
		dispatch(loadLikedPosts(data));
        const likeId = data.liked_posts_by_id[0]
        const likeStatus = data.liked_posts[likeId]?.like_status || "neutral"
        return likeStatus
	}
	dispatch(errorPostLike);
    return
};

// Get all posts liked/disliked by current user
export const loadCurrentUserAllPostLikesThunk = () => async (dispatch) => {
	const res = await fetch(`/api/users/current/posts/all/likes`);
	const data = await res.json();
	if (res.ok) return dispatch(loadLikedPosts(data));
	return dispatch(errorPostLike);
};

// Get all post likes made by specific user
export const loadUserPostLikesThunk = (userId) => async (dispatch) => {
	const res = await fetch(`/api/users/${userId}/posts/all/likes`);
	const data = await res.json();
	if (res.ok) return dispatch(loadLikedPosts(data));
	return dispatch(errorPostLike);
};

// create a like/dislike on a post
export const handlePostLikesThunk = (likeInfo, postId) => async (dispatch) => {
	const res = await fetch(`/api/posts/${postId}/likes`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ like_status: likeInfo }),
	});
	const data = await res.json();
	if (res.ok) {
		dispatch(handlePostLikes(data, data.action_type));
		return data;
	}
	dispatch(errorPostLike);
    return null
};

// export const deleteLikePostThunk = (postId) => async (dispatch) => {
// 	const res = await fetch(`/api/posts/${postId}/likes`, {
// 		method: "DELETE",
// 	});

// 	const data = await res.json();
// 	if (res.ok) return dispatch(deletePostLike(data));
// 	return dispatch(errorPostLike);
// };

// ------------------------------ REDUCERS ------------------------------ //

const initialState = {
	likedPostsById: [],
	likedPosts: {}
};

const postLikesReducer = (state = initialState, action) => {
	const newState = { ...state };

	// gets the id that would be returned from a single post like query
	const postLikeId = action.payload && "post_likes_by_id" in action.payload ? action.payload.post_likes_by_id[0] : null;

	switch (action.type) {
		case LOAD_LIKED_POSTS:
            newState.likedPosts = action.payload.liked_posts
            newState.likedPostsById = action.payload.liked_posts_by_id
			return newState;
		case CREATE_POST_LIKE:
			newState.likedPostsById.push(postLikeId);
			newState.likedPosts[postLikeId] = action.payload.all_post_likes[postLikeId];
			newState.likedPostsById.push(postLikeId);
			newState.likedPosts[postLikeId] = action.payload.all_post_likes[postLikeId];
			return newState;
		case UPDATE_POST_LIKE:
			newState.likedPosts[postLikeId] = action.payload.all_post_likes[postLikeId];
			newState.likedPosts[postLikeId] = action.payload.all_post_likes[postLikeId];
			return newState;
		case DELETE_POST_LIKE:
			newState.likedPostsById = newState.likedPostsById.filter((el) => el !== action.payload.id);
			newState.likedPostsById = newState.likedPostsById.filter((el) => el !== action.payload.id);
			delete newState.likedPosts[postLikeId];
			delete newState.likedPosts[postLikeId];
			return newState;
		case ERROR_POST_LIKE:
			return newState;
		default:
			return newState;
	}
};

export default postLikesReducer;
