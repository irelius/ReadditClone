import "./SinglePost.css";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

import { useEffect, useState } from "react";

export default function SinglePost({ post }) {
	TimeAgo.addLocale(en);

	const [load, setLoad] = useState(false);
	const [imageIndex, setImageIndex] = useState(0);

	useEffect(() => {
		if (post.id) {
			setLoad(true);
		}
	}, []);

	const subreddit = post.subreddits;
	const imagesById = post.images.images_by_id;
	const images = post.images.images;
    
	const timeAgo = new TimeAgo("en-US");
	const time = timeAgo.format(new Date(post.created_at), "round");

	const imageRotation = (dir) => {
		if (dir === "left") {
			setImageIndex((prev) => Math.max(prev - 1, 0));
		} else if (dir === "right") {
			setImageIndex((prev) => Math.min(prev + 1, imagesById.length - 1));
		}
	};

	return load ? (
		<div>
			<section className="fdr gap-5px">
				<aside>icon</aside>
				<aside>r/{post.subreddits.name}</aside>
				<aside className="fdr aic">
					<i className="fa-solid fa-circle dot"></i>
				</aside>
				<aside>{time}</aside>
			</section>
			<section>{post.title}</section>
			{/* <section>{post.body}</section> */}
			<section>
				{imagesById.length > 0 ? (
					<section className="post-image-container dfr aic">
						<aside className="pointer" onClick={() => imageRotation("left")}>
							{"<"}
						</aside>
						<img className="post-image" src={`${images[imagesById[imageIndex]].image_url}`} />
						<aside className="pointer" onClick={() => imageRotation("right")}>
							{">"}
						</aside>
					</section>
				) : (
					<></>
				)}
			</section>

			<section>temporary body</section>
			<section>
				<aside>
					<aside>upvote</aside>
					<aside>vote val</aside>
					<aside>downvote</aside>
				</aside>
				<aside>comments</aside>
				{/* <aside>share</aside> */}
			</section>
		</div>
	) : (
		<></>
	);
}
