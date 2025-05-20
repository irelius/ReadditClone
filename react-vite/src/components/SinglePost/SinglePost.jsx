import "./SinglePost.css";

import TimeAgo from "javascript-time-ago";
import millify from "millify";
import en from "javascript-time-ago/locale/en";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadPostCommentsThunk } from "../../redux/comment";
import { handlePostLikesThunk, loadLikesPostThunk } from "../../redux/postLike";

export default function SinglePost({ post, likeStatus = null }) {
	const dispatch = useDispatch();

	TimeAgo.addLocale(en);
	const timeAgo = new TimeAgo("en-US");
	const time = timeAgo.format(new Date(post.created_at), "round");

	const [load, setLoad] = useState(false);
	const [imageIndex, setImageIndex] = useState(0);
	const [commentsCount, setCommentsCount] = useState(0);
	const [postLikeStatus, setPostLikeStatus] = useState(likeStatus);
	const [likesCount, setLikesCount] = useState(millify(post.total_likes));

	useEffect(() => {
		if (post.id) {
			// setCommentsCount(millify(post.comments_count));
			setLoad(true);
		}
	}, []);

	// // millify the comment counts
	// useEffect(() => {
	// 	const commentsCount = millify(post.comments_count);
	// 	setCommentsCount(commentsCount);
	// }, [commentsCount]);

	const subreddit = post.subreddits;
	const imagesById = post.images.images_by_id;
	const images = post.images.images;

	const handlePostLike = (status) => {
		dispatch(handlePostLikesThunk(status, post.id)).then((res) => {
			if (res.like_status !== null) {
                const newLikeStatus = res.total_likes === 1 ? "like" : "dislike"
				setPostLikeStatus((prev) => newLikeStatus);
			} else {
				setPostLikeStatus(res.like_status);
			}
			dispatch(loadLikesPostThunk(post.id)).then((res) => {
				setLikesCount(millify(res));
			});
		});
	};

	// postLikeStatus = useSelector((state) => state.postLikes.likedPosts)[post.id];

	const imageRotation = (dir) => {
		if (dir === "left") {
			setImageIndex((prev) => Math.max(prev - 1, 0));
		} else if (dir === "right") {
			setImageIndex((prev) => Math.min(prev + 1, imagesById.length - 1));
		}
	};

	return load ? (
		<div className="single-post-container">
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
					// post text body
					<section className="post-body-container font-light-gray">
						<aside>{post.body}</aside>
					</section>
				)}
			</section>

			{/* SinglePost - vote and comment section */}
			<section className="dfr aic gap-1em post-bottom-bar">
				{/* vote aside */}
				<aside className="dfr aic jcc font-white background-gray vote-container">
					<aside>
						<i
							onClick={() => handlePostLike("like")}
							className={`pointer vote-arrow arrow-up-${postLikeStatus === "like"} fa-regular fa-circle-up`}
						/>
					</aside>
					<aside className="dfr aic jcc post-likes-total font-12">{likesCount}</aside>
					<aside>
						<i
							onClick={() => handlePostLike("dislike")}
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
			<section className="post-border"></section>
		</div>
	) : (
		<></>
	);
}
