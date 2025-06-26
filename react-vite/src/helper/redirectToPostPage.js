export default function redirectToPostPage(e, navigate, postId, subredditName) {
	e.preventDefault();
	e.stopPropagation();
	return navigate(`/r/${subredditName}/${postId}`);
}
