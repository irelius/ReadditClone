import "./MainPage.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";

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
// import { loadErrorsThunk } from "../../redux/error";

export default function MainPage() {
	const dispatch = useDispatch();
	const [load, setLoad] = useState(false);
	const [counter, setCounter] = useState(0);
	const [errors, setErrors] = useState([]);

	const userInfo = {
		email: "demo@user.io",
		password: "password",
	};

	useEffect(() => {
		dispatch(loadCommentThunk(1)).then(() => setLoad(true));
		setLoad(true);
	}, []);

	const handlePost = () => {
		const body = {
			// title: "new post title 1",
			// is_reply: false,
			body: "reply body",
		};

		dispatch(createCommentOnCommentThunk(body, 200)).then((res) => {
            errorSetter(res, setErrors)
		});
	};

    useEffect(() => {
        console.log('errors', errors)
    }, [errors])


	return load ? (
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
				<button onClick={() => handlePost()}>Post</button>
			</section>
			{/* <section>
				<button onClick={() => handlePut()}>Put</button>
			</section> */}
		</div>
	) : (
		<>not loading error</>
	);
}
