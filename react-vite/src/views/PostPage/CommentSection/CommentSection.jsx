import "./CommentSection.css";

import SingleComment from "../../../components/SingleComment";

export default function CommentSection({ comments, commentsById }) {
	return commentsById.length > 0 ? (
		<div className="dfc gap-1em">
			{commentsById.map((el) => {
				const currComment = comments[el];
				return (
					<div key={el} className="dfc gap-05em">
						<section className="comment-node-container">
							<SingleComment comment={currComment} />
						</section>
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
