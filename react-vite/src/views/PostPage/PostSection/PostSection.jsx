import { useState } from "react";
import "./PostSection.css";

import TimeAgo from "javascript-time-ago";
import millify from "millify";
import en from "javascript-time-ago/locale/en";

export default function PostSection({ post }) {
	TimeAgo.addLocale(en);
	const timeAgo = new TimeAgo("en-US");
	const time = timeAgo.format(new Date(post.created_at), "round");

	const subreddit = post.subreddits.name;
	const poster = post.users.username;
	const title = post.title;
	const images = post.images.images;
	const imagesById = post.images.images_by_id;

	const [imageIndex, setImageIndex] = useState(0);

	// function to handle image rotation
	const imageRotation = (dir) => {
		if (dir === "left") {
			setImageIndex((prev) => Math.max(prev - 1, 0));
		} else if (dir === "right") {
			setImageIndex((prev) => Math.min(prev + 1, imagesById.length - 1));
		}
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
					<section className="font-12 pointer">{poster}</section>
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
			<section className="font-16 font-light-gray">{post.body}</section>

			{/* PostSection - vote and comment section */}
			<section>post likes and whatnot bar</section>
		</div>
	);
}
