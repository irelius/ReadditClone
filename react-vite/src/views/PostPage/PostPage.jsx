import { useParams } from "react-router-dom";
import "./PostPage.css";
import PostSection from "./PostSection";
import CommentSection from "./CommentSection";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadPostThunk } from "../../redux/post";
import { loadPostCommentsThunk } from "../../redux/comment";

export default function PostPage() {
	const dispatch = useDispatch();
	const params = useParams();
	const subredditName = params.subredditName;
	const postId = params.postId;

	const [load, setLoad] = useState(false);

	useEffect(() => {
		if (postId) {
			dispatch(loadPostThunk(postId));
			dispatch(loadPostCommentsThunk(postId));
			setLoad(true);
		}
	}, []);

	const post = useSelector((state) => state.post.posts[postId]);
	const comments = useSelector((state) => state.comment.comments);
    const commentsById = useSelector(state => state.comment.commentsById)

	return load && post && comments ? (
		<div>
			<section>
				<PostSection post={post} />
			</section>
			<section>
				<CommentSection comments={comments} commentsById={commentsById} />
			</section>
		</div>
	) : (
		<></>
	);
}
