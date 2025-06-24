export default function redirectToPostPage(e, navigate, postId, subredditName) {
    console.log('invoked - booba redirect to Post Page helper func')

	e.preventDefault();
	e.stopPropagation();
	return navigate(`/r/${subredditName}/${postId}`);
}
