import "./SinglePost.css";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

import { useEffect, useState } from "react";

export default function SinglePost({ post }) {
	TimeAgo.addLocale(en);

	if (post.id === 1) {
		console.log("booba", post);
	}

	const [load, setLoad] = useState(false);

	useEffect(() => {
		if (post.id) {
			setLoad(true);
		}
	}, []);

	const subreddit = post.subreddits;
    const imagesById = post.images.images_by_id
    const images = post.images.images

    if(imagesById.length > 0) {
        console.log('booba', images)
    }

	const timeAgo = new TimeAgo("en-US");
	const time = timeAgo.format(new Date(post.created_at), "round");

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
            {/* {imagesById.length > 0 ? (
                {imagesById.map(el => {
                    
                })}
                <section>

                </section>
            ) : (
                <></>
            )} */}
            {imagesById.map(el => {
                const url = images[el].image_url
                return (
                    <section className="post-image-container">
                        <img className="post-image" src={`${url}`}></img>
                    </section>
                )
            })}

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
