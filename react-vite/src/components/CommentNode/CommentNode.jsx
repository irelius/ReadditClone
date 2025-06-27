import "./CommentNode.css";

export default function CommentNode({ comment, depth = 1 }) {
	if (!comment) {
		return;
	}

	const replies = comment.replies;
	const repliesById = comment.replies_by_id;

    const styling = {
        "margin-left": `2em`
    }

	return (
		<div className="dfc gap-1em">
			<section>{comment.body}</section>
			<section style={styling}>
				{repliesById.map((el) => {
					const reply = replies[el];
					return (
						<div key={el}>
							<CommentNode comment={reply} depth={depth + 1} />
						</div>
					);
				})}
			</section>
		</div>
	);
}
