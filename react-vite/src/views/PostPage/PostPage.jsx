import "./PostPage.css";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import PostSection from "./PostSection";
import CommentSection from "./CommentSection";

import { loadPostThunk } from "../../redux/post";
import { loadCurrentUserOnePostLikesThunk } from "../../redux/postLike";
import { loadPostCommentsThunk } from "../../redux/comment";

export default function PostPage() {
	const dispatch = useDispatch();
	const params = useParams();
	const subredditName = params.subredditName;
	const postId = params.postId;

	const [load, setLoad] = useState(false);
	const [postLikeStatus, setPostLikeStatus] = useState("neutral");

	useEffect(() => {
		if (postId) {
			dispatch(loadPostThunk(postId));
			dispatch(loadPostCommentsThunk(postId));
			dispatch(loadCurrentUserOnePostLikesThunk(postId)).then((res) => {
				const userLikeStatus = res.liked_posts_by_id.length > 0 ? res.liked_posts[postId].like_status : "neutral";
				setPostLikeStatus((prev) => userLikeStatus);
			});
			setLoad(true);
		}
	}, []);



	const post = useSelector((state) => state.post.posts[postId]);
	const comments = useSelector((state) => state.comment.comments);
	const commentsById = useSelector((state) => state.comment.commentsById);
	const userLikeStatus = useSelector((state) => state.postLike.likedPosts);

	return load && post && comments ? (
		<div className="post-page-container font-white dfc gap-2em">
			<section>
				<PostSection post={post} postLikeStatus={postLikeStatus} setPostLikeStatus={setPostLikeStatus} />
			</section>
			{/* <section className="post-border" /> */}
			<section>
				<CommentSection comments={comments} commentsById={commentsById} />
			</section>
		</div>
	) : (
		<></>
	);
}
