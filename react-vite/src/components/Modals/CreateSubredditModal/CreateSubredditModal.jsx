import "./CreateSubredditModal.css";

export default function CreateSubredditModal({ isOpen, keepOpen, currUser }) {
	if (!isOpen) return null;

	return (
		<div className="test" onClick={() => keepOpen(false)}>
			<section>CreateSubredditModal Placeholder</section>
		</div>
	);
}
