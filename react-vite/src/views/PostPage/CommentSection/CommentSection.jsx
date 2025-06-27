import "./CommentSection.css";

// import { useState } from "react";

import CommentNode from "../../../components/CommentNode";

export default function CommentSection({ comments, commentsById }) {
	return commentsById.length > 0 ? (
		<div className="dfc gap-1em">
			{commentsById.map((el) => {
 				return (
					<div key={el}>
						<CommentNode comment={comments[el]} />
					</div>
				);
			})}
		</div>
	) : (
		<div>
			<section>Be the first to comment</section>
			<section>Nobody's responded to this post yet. Add your thoughts and get the conversation going.</section>
		</div>
	);
}