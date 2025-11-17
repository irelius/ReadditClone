import "./SingleComment.css";

import TimeAgo from "javascript-time-ago";
import millify from "millify";
import en from "javascript-time-ago/locale/en";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { handleCommentLikesThunk } from "../../redux/commentLike";
import likeHandlerHelper from "../../helper/likeHandlerHelper";

export default function SingleComment({ comment, userCommentLikes, depth = 1 }) {
	if (!("id" in comment)) return null;

	const dispatch = useDispatch();

	TimeAgo.addLocale(en);
	const timeAgo = new TimeAgo("en-US");
	const time = timeAgo.format(new Date(comment.created_at), "round");

	const commentId = comment.id;
	const postId = comment.post_id;
	const replies = comment.replies;
	const repliesById = comment.replies_by_id;
	const profileImage = comment.users.profile_image;
	const username = comment.users.username;

	const [display, setDisplay] = useState(true);
	const [commentLikeStatus, setCommentLikeStatus] = useState(
		commentId in userCommentLikes ? userCommentLikes[commentId].like_status : "neutral"
	);
	const [commentLikesCount, setCommentsLikeCount] = useState(comment.total_likes);
	const [likeError, setLikeError] = useState(null);

	const styling = {
		marginLeft: `2.3em`,
	};

	const handleCommentLike = (e, action) => {
		e.stopPropagation();
		dispatch(handleCommentLikesThunk(action, commentId, postId)).then((res) => {
			if (res) {
				likeHandlerHelper(action, setCommentsLikeCount, commentLikeStatus, setCommentLikeStatus);
			} else {
				if (action === "like") setLikeError("Oops. There was an error liking this comment.");
				else setLikeError("Oops. There was an error disliking this comment.");
			}
		});
	};

	return (
		<div>
			{/* single comment - comment itself (not replies) */}
			<section>
				{/* single comment - header row (profile name, image, time posted) */}
				<section className="dfr aic gap-05em comment-header-section" onClick={() => setDisplay((prev) => !prev)}>
					{display ? (
						<img className="small-icon" src={profileImage} />
					) : (
						<div className="dfc aic jcc comment-profile-plus-icon pointer">
							<i className="fa-solid fa-circle-plus"></i>
						</div>
					)}
					<aside className="font-14 font-bold">{username}</aside>
					<i className="fa-solid fa-circle dot font-gray"></i>
					<aside className="font-14 font-gray">{time}</aside>
				</section>

				{/* single comment - comment body (comment and vote/comment/etc. section) */}
				{display ? (
					<section className="comment-body-container">
						{/* single comment - collapse line */}
						<aside onClick={() => setDisplay((prev) => !prev)} className="comment-collapse-container pointer">
							<i className="fa-solid fa-circle-minus comment-collapse-icon"></i>
							<section className="comment-collapse-line"></section>
						</aside>

						{/* */}
						<aside className="dfc gap-05em comment-body-section">
							{/* single comment - comment body */}
							<section className="comment-body">{comment.body}</section>

							{/* single comment - comment bar (likes, replies, etc.) */}
							<section className="dfr aic comment-status-bar">
								{/* single comment - comment bar VOTE section */}
								<aside className="dfr aic font-gray comment-vote-container">
									<aside>
										<i
											onClick={(e) => handleCommentLike(e, "like")}
											className={`pointer comment-vote-arrow
                                            comment-liked-${commentLikeStatus === "like"}
                                            liked-${commentLikeStatus === "like"}
                                            fa-regular fa-circle-up fa-xl`}></i>
									</aside>
									<aside className="comment-likes-total font-12">{millify(commentLikesCount)}</aside>
									<aside>
										<i
											onClick={(e) => handleCommentLike(e, "dislike")}
											className={`pointer comment-vote-arrow 
                                            comment-disliked-${commentLikeStatus === "dislike"}
                                            disliked-${commentLikeStatus === "dislike"}
                                            fa-regular fa-circle-down fa-xl`}></i>
									</aside>
								</aside>

								{/* single comment - comment bar REPLY section */}
								<aside className="dfr jcc aic gap-05em pointer comment-reply-container">
									<aside>
										<i className="fa-solid fa-comment"></i>
									</aside>
									<aside>Reply</aside>
								</aside>

								{/* single comment - comment bar ETC section */}
								<aside></aside>
							</section>
						</aside>
					</section>
				) : (
					<></>
				)}
			</section>

			{/* single comment - comment replies (recursion) */}
			{display ? (
				<section style={styling}>
					{repliesById.map((el) => {
						const reply = replies[el];
						return (
							<div key={el} className="dfc">
								<section className="margin-t-05em">
									<SingleComment comment={reply} userCommentLikes={userCommentLikes} depth={depth + 1} />
								</section>
							</div>
						);
					})}
				</section>
			) : (
				<></>
			)}
		</div>
	);
}
