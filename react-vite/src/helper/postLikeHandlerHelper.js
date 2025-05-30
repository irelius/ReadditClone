export default function postLikeHandlerHelper(action, setLikesCount, likeStatus, setLikeStatus) {
	const likeAdjustments = {
		like: {
			like: -1,
			dislike: -2,
		},
		dislike: {
			like: 2,
			dislike: 1,
		},
		neutral: {
			like: 1,
			dislike: -1,
		},
	};

	const adjustment = likeStatus === null ? likeAdjustments["neutral"][action] : likeAdjustments[likeStatus][action];
    setLikesCount((prev) => prev + adjustment);


	const newStatus = likeStatus === action ? "neutral" : action;
	setLikeStatus(newStatus);
}
