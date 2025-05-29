import "./SinglePost.css";

import TimeAgo from "javascript-time-ago";
import millify from "millify";
import en from "javascript-time-ago/locale/en";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadPostCommentsThunk } from "../../redux/comment";
import { handlePostLikesThunk } from "../../redux/postLike";
import { useNavigate } from "react-router-dom";

import redirectToPostPage from "../../helper/redirectToPostPage";

export default function SinglePost({ post, likeStatus = null }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	TimeAgo.addLocale(en);
	const timeAgo = new TimeAgo("en-US");
	const time = timeAgo.format(new Date(post.created_at), "round");

	const [load, setLoad] = useState(false);
	const [imageIndex, setImageIndex] = useState(0);
	const [commentsCount, setCommentsCount] = useState(post.comments_count);
	const [postLikeStatus, setPostLikeStatus] = useState(likeStatus);
	const [likesCount, setLikesCount] = useState(post.total_likes);
	const [likeError, setLikeError] = useState(null);

	useEffect(() => {
		if (post.id) {
			setLoad(true);
		}
	}, []);

	const subreddit = post.subreddits;
	const imagesById = post.images.images_by_id;
	const images = post.images.images;

	// function to handle image rotation
	const imageRotation = (dir) => {
		if (dir === "left") {
			setImageIndex((prev) => Math.max(prev - 1, 0));
		} else if (dir === "right") {
			setImageIndex((prev) => Math.min(prev + 1, imagesById.length - 1));
		}
	};

	// handle liking a post. done with optimistic UI and backend confirmation
	const handlePostLike = (e, action) => {
		e.stopPropagation();
		dispatch(handlePostLikesThunk(action, post.id)).then((res) => {
			if (res) {
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

				const adjustment =
					postLikeStatus === null ? likeAdjustments["neutral"][action] : likeAdjustments[postLikeStatus][action];
				setLikesCount((prev) => prev + adjustment);

				const newStatus = postLikeStatus === action ? "neutral" : action;
				setPostLikeStatus(newStatus);
			} else {
				if (action === "like") setLikeError("Oops. There was an error liking this post.");
				else setLikeError("Oops. There was an error disliking this post.");
			}
		});
	};

	return load ? (
		<div
			className="single-post-container"
			onClick={(e) => {
				redirectToPostPage(e, navigate, post.id, subreddit.name);
			}}>
			{/* Single Post - top section (subreddit name & icon, post date) */}
			<section className="dfr aic gap-5px">
				<aside className="reddit-logo-container dfr jcc aic color-white">
					<i className="fa-brands fa-reddit-alien fa-lg"></i>
				</aside>
				<aside className="font-12 font-light-gray">r/{subreddit.name}</aside>
				<aside className="dfr aic">
					<i className="fa-solid fa-circle dot font-gray"></i>
				</aside>
				<aside className="font-12 font-gray">{time}</aside>
			</section>

			{/* SinglePost - Title */}
			<section className="font-white font-20">{post.title}</section>

			{/* SinglePost - image or text body section */}
			<section>
				{/* image */}
				{imagesById.length > 0 ? (
					<section className="post-image-container dfr aic">
						<aside
							className={`image-arrow-container image-arrow-${imageIndex === 0}`}
							onClick={(e) => {
								e.stopPropagation();
								imageRotation("left");
							}}>
							<i className={`fa-solid fa-chevron-left fa-xl`}></i>
						</aside>
						<img className="post-image" src={`${images[imagesById[imageIndex]].image_url}`} />
						<aside
							className={`image-arrow-container image-arrow-${imageIndex === imagesById.length - 1}`}
							onClick={(e) => {
								e.stopPropagation();
								imageRotation("right");
							}}>
							<i className={`fa-solid fa-chevron-right fa-xl`}></i>
						</aside>
					</section>
				) : (
					// post text body
					<section className="post-body-container font-light-gray">
						<aside>{post.body}</aside>
					</section>
				)}
			</section>

			{/* SinglePost - vote and comment section */}
			<section className="dfr aic gap-1em post-bottom-bar">
				{/* vote aside */}
				<aside className={`dfr aic jcc font-white background-gray vote-container post-${postLikeStatus}`}>
					<aside>
						<i
							onClick={(e) => handlePostLike(e, "like")}
							className={`pointer vote-arrow arrow-up-${postLikeStatus === "like"} fa-regular fa-circle-up`}
						/>
					</aside>
					<aside className={`dfr aic jcc post-likes-total font-12`}>{millify(likesCount)}</aside>
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
					<aside className="font-12">{post.comments_count}</aside>
				</aside>
				{/* <aside>share</aside> */}
			</section>
		</div>
	) : (
		<></>
	);
}
