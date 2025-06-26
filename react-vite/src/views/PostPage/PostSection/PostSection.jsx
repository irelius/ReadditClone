import "./PostSection.css";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import TimeAgo from "javascript-time-ago";
import millify from "millify";
import en from "javascript-time-ago/locale/en";

import { handlePostLikesThunk } from "../../../redux/postLike";
import postLikeHandlerHelper from "../../../helper/postLikeHandlerHelper";

export default function PostSection({ post, postLikeStatus, setPostLikeStatus }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	TimeAgo.addLocale(en);
	const timeAgo = new TimeAgo("en-US");
	const time = timeAgo.format(new Date(post.created_at), "round");

	const subreddit = post.subreddits.name;
	const poster = post.users.username;
	const title = post.title;
	const images = post.images.images;
	const imagesById = post.images.images_by_id;

	const [imageIndex, setImageIndex] = useState(0);
	const [postLikesCount, setPostLikesCount] = useState(post.total_likes);
	const [commentsCount, setCommentsCount] = useState(post.comments_count);
	const [createNewComment, setCreateNewComment] = useState(false);
	const [inputFocused, setInputFocused] = useState(false);
	const [newComment, setNewComment] = useState("");

	// function to handle image rotation
	const imageRotation = (dir) => {
		if (dir === "left") {
			setImageIndex((prev) => Math.max(prev - 1, 0));
		} else if (dir === "right") {
			setImageIndex((prev) => Math.min(prev + 1, imagesById.length - 1));
		}
	};

	const handlePostLike = (e, action) => {
		// e.stopPropagation();
		dispatch(handlePostLikesThunk(action, post.id)).then((res) => {
			if (res) {
				postLikeHandlerHelper(action, setPostLikesCount, postLikeStatus, setPostLikeStatus);
			} else {
				if (action === "like") setLikeError("Oops. There was an error liking this post.");
				else setLikeError("Oops. There was an error disliking this post.");
			}
		});
	};

	return (
		<div className="dfc post-section-container gap-05em">
			{/* PostSection - post top section (subreddit and poster info) */}
			<section className="dfr gap-05em">
				<aside className="subreddit-icon dfr jcc aic pointer">
					<i className="fa-brands fa-reddit-alien fa-xl"></i>
				</aside>
				<aside className="dfc jcc gap-3px">
					<section className="dfr aic gap-5px">
						<aside className="font-12 font-light-gray pointer">r/{subreddit}</aside>
						<aside className="dfr aic">
							<i className="fa-solid fa-circle dot font-gray"></i>
						</aside>
						<aside className="font-12 font-gray">{time}</aside>
					</section>
					<section className="font-12 pointer">u/{poster}</section>
				</aside>
			</section>

			{/* PostSection - post title */}
			<section className="font-bold font-24">{title}</section>

			{/* PostSection - image section (if images exist) */}
			{imagesById.length > 0 ? (
				<section className="post-section-image-container dfr aic">
					<aside
						className={`image-arrow-container image-arrow-${imageIndex === 0}`}
						onClick={() => imageRotation("left")}>
						<i className={`fa-solid fa-chevron-left fa-xl`}></i>
					</aside>
					<img className="post-image" src={`${images[imagesById[imageIndex]].image_url}`} />
					<aside
						className={`image-arrow-container image-arrow-${imageIndex === imagesById.length - 1}`}
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
				<aside className={`dfr aic jcc font-white background-gray vote-container post-${postLikeStatus}`}>
					<aside>
						<i
							onClick={(e) => handlePostLike(e, "like")}
							className={`pointer vote-arrow arrow-up-${postLikeStatus === "like"} fa-regular fa-circle-up`}
						/>
					</aside>
					<aside className={`dfr aic jcc post-likes-total font-12`}>{millify(postLikesCount)}</aside>
					<aside>
						<i
							onClick={(e) => handlePostLike(e, "dislike")}
							className={`pointer vote-arrow arrow-down-${postLikeStatus === "dislike"} fa-regular fa-circle-down`}
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
			<section className="create-comment-container">
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
					<div className={`create-comment-section-${createNewComment} border-highlight-${inputFocused} dfc gap-1em`}>
						<textarea
							autoFocus
							className="create-comment-input"
							onClick={() => setInputFocused(true)}
							onBlur={(e) => setInputFocused(false)}
							onChange={(e) => setNewComment(e.target.value)}
						/>
						<section
							className={`create-comment-buttons-container font-12 font-bold`}
							onClick={(e) => e.preventDefault()}>
							<button
								className="create-comment-cancel pointer"
								onClick={() => {
									setNewComment("");
									setCreateNewComment(false);
								}}>
								Cancel
							</button>
							<button className="create-comment-confirm pointer">Comment</button>
						</section>
					</div>
				)}
			</section>
		</div>
	);
}
