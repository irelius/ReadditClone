import "./PostSection.css";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import TimeAgo from "javascript-time-ago";
import millify from "millify";
import en from "javascript-time-ago/locale/en";

import { handlePostLikesThunk, loadCurrentUserOnePostLikesThunk } from "../../../redux/postLike";
import likeHandlerHelper from "../../../helper/likeHandlerHelper";
import { createCommentOnPostThunk } from "../../../redux/comment";
import errorSetter from "../../../helper/error";
import { loadPostThunk } from "../../../redux/post";

export default function PostSection({ postId, setNewCommentCreated }) {
	const dispatch = useDispatch();

	TimeAgo.addLocale(en);
	const timeAgo = new TimeAgo("en-US");

	// post stuff
	const [postLikeStatus, setPostLikeStatus] = useState("neutral");
	const [postLikesCount, setPostLikesCount] = useState(null);
	const [likeError, setLikeError] = useState(null);
	const [time, setTime] = useState(null);

	// image stuff
	const [imageIndex, setImageIndex] = useState(0);

	// comment stuff
	const [inputFocused, setInputFocused] = useState(false);
	const [newComment, setNewComment] = useState("");
	const [createNewComment, setCreateNewComment] = useState(false);
	const [commentsCount, setCommentsCount] = useState(null);
	const [commentError, setCommentError] = useState(null);

	useEffect(() => {
		dispatch(loadPostThunk(postId));
		dispatch(loadCurrentUserOnePostLikesThunk(postId)).then((res) => {
			setPostLikeStatus(res);
		});
	}, []);

	const post = useSelector((state) => state.post.posts[postId]);

	useEffect(() => {
		if (post) {
			setPostLikesCount(post.total_likes);
			setCommentsCount(post.comments_count);
			setTime(timeAgo.format(new Date(post.created_at), "round"));
		}
	}, [post]);

	// function to handle image rotation
	const imageRotation = (dir) => {
		if (dir === "left") {
			setImageIndex((prev) => Math.max(prev - 1, 0));
		} else if (dir === "right") {
			setImageIndex((prev) => Math.min(prev + 1, imagesById.length - 1));
		}
	};

	const handlePostLike = (action) => {
		dispatch(handlePostLikesThunk(action, post.id)).then((res) => {
			if (res) {
				likeHandlerHelper(action, setPostLikesCount, postLikeStatus, setPostLikeStatus);
			} else {
				setLikeError("Oops. Something went wrong. We'll look into that.");
			}
		});
	};

	const handleComment = (e) => {
		e.preventDefault();

		const trimmed = newComment.trim();
		setNewComment(trimmed);
		if (trimmed.length === 0) {
			setCommentError("The field is required and cannot be empty");
		} else {
			const commentInfo = {
				body: newComment,
			};

			dispatch(createCommentOnPostThunk(commentInfo, post.id)).then((res) => {
				errorSetter(res, commentError);
				if (res.type !== "ERROR_COMMENT") {
					setNewCommentCreated((prev) => !prev);
					setCommentsCount((prev) => prev + 1);
				}
			});
            setNewComment("");
            setInputFocused(false);
            setCreateNewComment(false);
		}
	};

	return (
		post && (
			<div className="dfc post-section-container gap-05em">
				{/* PostSection - post top section (subreddit and poster info) */}
				<section className="dfr gap-05em">
					<aside className="small-icon dfr jcc aic pointer">
						<i className="fa-brands fa-reddit-alien fa-xl"></i>
					</aside>
					<aside className="dfc jcc gap-3px">
						<section className="dfr aic gap-5px">
							<aside className="font-12 font-light-gray pointer">r/{post.subreddits.name}</aside>
							<aside className="dfr aic">
								<i className="fa-solid fa-circle dot font-gray"></i>
							</aside>
							<aside className="font-12 font-gray">{time}</aside>
						</section>
						<section className="font-12 pointer">u/{post.users.username}</section>
					</aside>
				</section>

				{/* PostSection - post title */}
				<section className="font-bold font-24">{post.title}</section>

				{/* PostSection - image section (if images exist) */}
				{post.images.images_by_id.length > 0 ? (
					<section className="post-section-image-container dfr aic">
						<aside
							className={`image-arrow-container image-arrow-${imageIndex === 0}`}
							onClick={() => imageRotation("left")}>
							<i className={`fa-solid fa-chevron-left fa-xl`}></i>
						</aside>
						<img className="post-image" src={`${post.images.images[post.images.images_by_id[imageIndex]].image_url}`} />
						<aside
							className={`image-arrow-container image-arrow-${imageIndex === post.images.images_by_id.length - 1}`}
							onClick={() => imageRotation("right")}>
							<i className={`fa-solid fa-chevron-right fa-xl`}></i>
						</aside>
					</section>
				) : (
					<></>
				)}

				{/* PostSection - post body */}
				<section className="post-body-section font-16 font-light-gray">{post.body}</section>

				{/* PostSection - vote and comment section */}
				<section className="dfr aic gap-1em post-bottom-section">
					{/* vote aside */}
					<aside className={`dfr aic jcc font-white background-gray post-vote-container post-${postLikeStatus}`}>
						<aside>
							<i
								onClick={() => handlePostLike("like")}
								className={`pointer post-vote-arrow
                                liked-${postLikeStatus === "like"}
                                fa-regular fa-circle-up`}
							/>
						</aside>
						<aside className={`dfr aic jcc post-likes-total font-12`}>{millify(postLikesCount)}</aside>
						<aside>
							<i
								onClick={() => handlePostLike("dislike")}
								className={`pointer post-vote-arrow 
                                disliked-${postLikeStatus === "dislike"}
                                fa-regular fa-circle-down`}
							/>
						</aside>
					</aside>

					{/* comment aside */}
					<aside className="dfr aic gap-10px pointer color-white background-gray comments-container">
						<aside>
							<i className="fa-regular fa-comment fa-lg"></i>
						</aside>
						<aside className="font-12">{millify(commentsCount)}</aside>
					</aside>
					{/* <aside>share</aside> */}
				</section>

				{/* PostSection - create a comment */}
				<section className={`create-comment-container`}>
					{createNewComment === false ? (
						<div
							onClick={() => {
								setCreateNewComment(true);
								setInputFocused(true);
							}}
							className={`font-gray create-comment-section-${createNewComment}`}>
							<div className="create-comment-textholder">Join the conversation</div>
						</div>
					) : (
						// PostSection - comment form
						<form
							onSubmit={(e) => handleComment(e)}
							className={`create-comment-section-${createNewComment} border-highlight-${inputFocused} comment-error-border-${
								commentError ? "true" : "false"
							} border-highlight-${inputFocused}  dfc gap-1em`}>
							{/* new comment text area */}
							<textarea
								autoFocus
								className="create-comment-input"
								value={newComment}
								onClick={() => setInputFocused(true)}
								onBlur={() => setInputFocused(false)}
								onChange={(e) => {
									setCommentError(null);
									setNewComment(e.target.value);
								}}
							/>
							{/* new comment buttons */}
							<section className={`create-comment-buttons-container font-12 font-bold`}>
								{/* new comment - cancel button */}
								<button
									className="create-comment-cancel pointer"
									onClick={() => {
										setNewComment("");
										setCommentError(null);
										setCreateNewComment(false);
									}}>
									Cancel
								</button>
								{/* new comment - submit button */}
								<button type="submit" className="create-comment-confirm pointer">
									Comment
								</button>
							</section>
						</form>
					)}
					<section className="create-comment-error-container font-12">
						{commentError && (
							<section className="dfr gap-05em">
								<aside>
									<i className="fa-solid fa-circle-exclamation"></i>
								</aside>
								<aside>{commentError}</aside>
							</section>
						)}
					</section>
				</section>
			</div>
		)
	);
}
