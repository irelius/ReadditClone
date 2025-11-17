// ------------------------------- ACTIONS ------------------------------- //
const LOAD_POSTS = "LOAD_POSTS";
const CREATE_POST = "CREATE_POST";
const UPDATE_POST = "PUT_POST";
const DELETE_POST = "DELETE_POST";
const ERROR_POST = "ERROR_POST";

// Get posts
export const loadPosts = (posts) => {
	return {
		type: LOAD_POSTS,
		payload: posts,
	};
};

// Create a new post
export const createPost = (post) => {
	return {
		type: CREATE_POST,
		payload: post,
	};
};

// Update a post
export const updatePost = (post) => {
	return {
		type: UPDATE_POST,
		payload: post,
	};
};

// Delete a post
export const deletePost = (post) => {
	return {
		type: DELETE_POST,
		payload: post,
	};
};

export const errorPost = (errors) => {
	return {
		type: ERROR_POST,
		payload: errors,
	};
};

// ------------------------------- THUNKS ------------------------------- //
// load all posts
export const loadPostsThunk = () => async (dispatch) => {
	const res = await fetch(`/api/posts/`);
	const data = await res.json();
	if (res.ok) return dispatch(loadPosts(data));
	return dispatch(errorPost(data));
};

// load a specific post
export const loadPostThunk = (postId) => async (dispatch) => {
    const res = await fetch(`/api/posts/${postId}`);
	const data = await res.json();
	if (res.ok) return dispatch(loadPosts(data));
	return dispatch(errorPost(data));
};

// load a specific user's posts
export const loadUserPostsThunk = (userId) => async (dispatch) => {
	const res = await fetch(`/api/users/${userId}/posts`);
	const data = await res.json();
	if (res.ok) return dispatch(loadPosts(data));
	return dispatch(errorPost(data));
};

// load current user's posts
export const loadCurrentUserPostsThunk = () => async (dispatch) => {
	const res = await fetch(`/api/users/current/posts`);
	const data = await res.json();
	if (res.ok) return dispatch(loadPosts(data));
	return dispatch(errorPost(data));
};

// load a subreddit's posts
export const loadSubredditPostsThunk = (subredditId) => async (dispatch) => {
	const res = await fetch(`/api/subreddits/${subredditId}/posts`);
	const data = await res.json();
	if (res.ok) return dispatch(loadPosts(data));
	return dispatch(errorPost(data));
};

// create a new post
export const createPostThunk = (postInfo) => async (dispatch) => {
	const res = await fetch(`/api/posts/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(postInfo),
	});

	const data = await res.json();
	if (res.ok) return dispatch(createPost(data));
	return dispatch(errorPost(data));
};

// update an existing post
export const updatePostThunk = (postInfo, postId) => async (dispatch) => {
	const res = await fetch(`/api/posts/${postId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(postInfo),
	});

	const data = await res.json();
	if (res.ok) return dispatch(updatePost(data));
	return dispatch(errorPost(data));
};

// delete a post
export const deletePostThunk = (postId) => async (dispatch) => {
	const res = await fetch(`/api/posts/${postId}`, {
		method: "DELETE",
	});

	const data = await res.json();
	if (res.ok) return dispatch(deletePost(data));
	return dispatch(errorPost(data));
};

// ------------------------------ REDUCERS ------------------------------ //

const initialState = {
	postsById: [],
	posts: {},
};

const postReducer = (state = initialState, action) => {
	const newState = { ...state };

	// gets the id that would be returned from a single post query
	const postId = action.payload && "posts_by_id" in action.payload ? action.payload.posts_by_id[0] : null;

	switch (action.type) {
		case LOAD_POSTS:
			newState.postsById = action.payload.posts_by_id;
			newState.posts = action.payload.all_posts;
			return newState;
		case CREATE_POST:
			newState.postsById.push(postId);
			newState.posts[postId] = action.payload.all_posts;
			return newState;
		case UPDATE_POST:
			newState.posts[postId] = action.payload.all_posts;
			return newState;
		case DELETE_POST:
			newState.postsById = newState.postsById.filter((el) => el !== action.payload.id);
			delete newState.posts[action.payload.id];
			return newState;
        case ERROR_POST:
            return newState
		default:
			return newState;
	}
};

export default postReducer;
