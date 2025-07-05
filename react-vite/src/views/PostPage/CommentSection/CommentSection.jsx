import "./CommentSection.css";

import SingleComment from "../../../components/SingleComment";

export default function CommentSection({ comments, commentsById, userCommentLikes }) {
	return commentsById.length > 0 ? (
		<div className="dfc">
			{commentsById.map((el) => {
				const currComment = comments[el];
				return (
					<div key={el} className="dfc margin-b-1em">
						<SingleComment comment={currComment} userCommentLikes={userCommentLikes}/>
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
