import { useState } from "react";
import "./PostSection.css";

import TimeAgo from "javascript-time-ago";
import millify from "millify";
import en from "javascript-time-ago/locale/en";

export default function PostSection({ post }) {
	console.log("booba", post);

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
		<div>
			<section>
				<aside>reddit logo</aside>
				<aside>
					<section className="dfr aic gap-5px">
						<aside className="reddit-logo-container dfr jcc aic color-white">
							<i className="fa-brands fa-reddit-alien fa-lg"></i>
						</aside>
						<aside className="font-12 font-light-gray">r/{subreddit}</aside>
						<aside className="dfr aic">
							<i className="fa-solid fa-circle dot font-gray"></i>
						</aside>
						<aside className="font-12 font-gray">{time}</aside>
					</section>
                    <section>
                        {poster}
                    </section>
				</aside>
			</section>
			<section>{title}</section>
			{imagesById.length > 0 ? (
				<section>
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
			<section>{post.body}</section>
			<section>post likes and whatnot bar</section>
		</div>
	);
}
