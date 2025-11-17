import "./PostPage.css";

import { useParams } from "react-router-dom";
import { useState } from "react";

import PostSection from "./PostSection";
import CommentSection from "./CommentSection";

// import { loadPostThunk } from "../../redux/post";
// import { loadCurrentUserOnePostLikesThunk } from "../../redux/postLike";
// import { loadPostCommentsThunk } from "../../redux/comment";
// import { loadCurrentUserOnePostCommentLikesThunk } from "../../redux/commentLike";

export default function PostPage() {
	// const dispatch = useDispatch();
	const params = useParams();
	const postId = Number(params.postId);

	const [newCommentCreated, setNewCommentCreated] = useState(false);

	return (
		<div className="post-page-container font-white dfc gap-2em">
			<section>
				<PostSection postId={postId} setNewCommentCreated={setNewCommentCreated} />
			</section>
			{/* <section className="post-border" /> */}
			<section>
				<CommentSection
					postId={postId}
					newCommentCreated={newCommentCreated}
				/>
			</section>
		</div>
	);
}
