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
import { loadSubredditThunk } from "../../redux/subreddit";
import errorSetter from "../../helper/error";
import { handlePostLikesThunk } from "../../redux/postLike";
// import { loadErrorsThunk } from "../../redux/error";

export default function MainPage() {
	const dispatch = useDispatch();
	const [load, setLoad] = useState(false);
	const [errors, setErrors] = useState([]);

	const { id } = useParams();

	const userInfo = {
		email: "demo@user.io",
		password: "password",
	};

    useEffect(() => {
        dispatch(loadPostThunk(id)).then((res) => {
            setLoad(true);
        });
    }, [dispatch, id]);

	const handlePost = (likeStatus) => {
		const body = {
			// title: "new post title 1",
			// is_reply: false,
			like_status: likeStatus,
		};

		dispatch(handlePostLikesThunk(body, 1)).then((res) => {
			errorSetter(res, setErrors);
			dispatch(loadPostThunk(id));
		});
	};

	// useEffect(() => {
	// 	console.log("main page errors: ", errors);
	// }, [errors]);

	const postsById = useSelector((state) => state.post.postsById);
	const post = useSelector((state) => state.post.posts);

	return load && postsById.length > 0 ? (
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
				<aside>{post[postsById[0]].body}</aside>
				<aside>{post[postsById[0]].total_likes}</aside>
				<aside></aside>
				<aside></aside>
			</section>
		</div>
	) : (
		<>not loading error</>
	);
}
