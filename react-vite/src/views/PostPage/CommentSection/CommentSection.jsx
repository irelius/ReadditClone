import "./CommentSection.css";

import SingleComment from "../../../components/SingleComment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadPostCommentsThunk } from "../../../redux/comment";
import { loadCurrentUserOnePostCommentLikesThunk } from "../../../redux/commentLike";

export default function CommentSection({ postId, newCommentCreated }) {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(loadPostCommentsThunk(postId));
		dispatch(loadCurrentUserOnePostCommentLikesThunk(postId));
	}, [newCommentCreated]);

	const comments = useSelector((state) => state.comment.comments);
	const commentsById = useSelector((state) => state.comment.commentsById);
	const userCommentLikes = useSelector((state) => state.commentLike.likedComments);

	return commentsById && commentsById.length > 0 ? (
		<div className="dfc">
			{commentsById.map((el) => {
				const currComment = comments[el];
				return (
					<div key={el} className="dfc margin-b-1em">
						<SingleComment comment={currComment} userCommentLikes={userCommentLikes} />
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
