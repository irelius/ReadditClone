import "./SingleComment.css";

import TimeAgo from "javascript-time-ago";
import millify from "millify";
import en from "javascript-time-ago/locale/en";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function SingleComment({ comment, depth = 1 }) {
	if (!comment) {
		return;
	}

    const dispatch = useDispatch()

	TimeAgo.addLocale(en);
	const timeAgo = new TimeAgo("en-US");
	const time = timeAgo.format(new Date(comment.created_at), "round");

	const replies = comment.replies;
	const repliesById = comment.replies_by_id;
	const profileImage = comment.users.profile_image;
	const username = comment.users.username;

    const [commentLikeStatus, setCommentLikeStatus] = useState()

    useEffect(() => {
        // dispatch()
    }, [])

	const styling = {
		marginLeft: `2em`,
	};

	return (
		<div className="dfc gap-1em">
			<section className="dfr aic gap-05em">
				<img className="small-icon" src={profileImage} />
				<aside className="font-14 font-bold">{username}</aside>
				<aside className="dfr aic">
					<i className="fa-solid fa-circle dot font-gray"></i>
				</aside>
				<aside className="font-14 font-gray jcc">{time}</aside>
			</section>
			<section>{comment.body}</section>
			<section style={styling}>
				{repliesById.map((el) => {
					const reply = replies[el];
					return (
						<div key={el} className="dfc gap-05em">
							{/* <section>{username}</section> */}
							<section>
								<SingleComment comment={reply} depth={depth + 1} />
							</section>
						</div>
					);
				})}
			</section>
		</div>
	);
}
