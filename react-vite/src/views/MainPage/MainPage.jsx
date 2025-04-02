import "./MainPage.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import ErrorHelper from "../../components/ErrorHelper/ErrorHelper";

import { login, logout } from "../../redux/session";
// import { loadAllUserThunk } from "../../redux/user";
import {
	createPostThunk,
	deletePostThunk,
	loadPostsThunk,
	updatePostThunk,
	loadPostThunk,
	loadSubredditPostsThunk,
	loadUserPostsThunk,
} from "../../redux/post";
import { createCommentOnCommentThunk, updateCommentThunk, loadCommentThunk } from "../../redux/comment";
import { loadSubredditThunk } from "../../redux/subreddit";
import errorSetter from "../../helper/error";
import { handleCommentLikesThunk } from "../../redux/commentLike";
// import { loadErrorsThunk } from "../../redux/error";

export default function MainPage() {
	const dispatch = useDispatch();
	const [load, setLoad] = useState(false);
	const [errors, setErrors] = useState([]);

	const { commentId } = useParams();

	const userInfo = {
		email: "demo@user.io",
		password: "password",
	};

	useEffect(() => {
		dispatch(loadCommentThunk(commentId)).then((res) => {
			setLoad(true);
		});
	}, [dispatch, commentId]);

	const handlePost = (likeStatus) => {
		const body = {
			// title: "new post title 1",
			// is_reply: false,
			like_status: likeStatus,
		};

		dispatch(handleCommentLikesThunk(body, 1)).then((res) => {
			errorSetter(res, setErrors);
            dispatch(loadCommentThunk(commentId))
		});
	};

	useEffect(() => {
		console.log("main page errors: ", errors);
	}, [errors]);

    const commentsById = useSelector(state => state.comment.commentsById)
	const comment = useSelector((state) => state.comment.comments);

    if(1 in comment) {
        console.log('booba', comment[1].total_likes)
    }

	return load && commentsById.length > 0 ? (
		<div>
			<section>
				{errors.map((el, i) => {
					return <section key={i}>{el}</section>;
				})}
			</section>
			<section>
				<button onClick={() => dispatch(login(userInfo))}>Login</button>
			</section>
			<section>
				<button onClick={() => dispatch(logout())}>Logout</button>
			</section>
			<section>
				<button onClick={() => handlePost("like")}>Upvote</button>
			</section>
			<section>
				<button onClick={() => handlePost("dislike")}>Downvote</button>
			</section>
			{/* <section>
				<button onClick={() => handlePut()}>Put</button>
			</section> */}
			<section>
				<aside>{comment[commentsById[0]].body}</aside>
				<aside>{comment[commentsById[0]].total_likes}</aside>
				<aside></aside>
				<aside></aside>
			</section>
		</div>
	) : (
		<>not loading error</>
	);
}
