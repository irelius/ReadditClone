import "./CommentSection.css";

export default function CommentSection({ comments, commentsById }) {
	return commentsById.length > 0 ? (
		<div>
			{commentsById.map((el, i) => {
				return <div key={i}>{comments[el].body}</div>;
			})}
		</div>
	) : (
		<div>
			<section>Be the first to comment</section>
			<section>Nobody's responded to this post yet. Add your thoughts and get the conversation going.</section>
		</div>
	);
}
