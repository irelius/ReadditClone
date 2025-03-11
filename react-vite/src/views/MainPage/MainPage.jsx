import "./MainPage.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";

import ErrorHelper from "../../components/ErrorHelper/ErrorHelper";

import { login } from "../../redux/session";
import { loadAllUserThunk } from "../../redux/user";
import { createPostThunk, deletePostThunk, loadPostsThunk, putPostThunk, loadPostThunk, loadSubredditPostsThunk } from "../../redux/post";
import {
	loadSubredditThunk,
	loadSubredditsThunk,
	loadUserSubredditThunk,
	loadCurrentUserSubredditThunk,
    createSubredditThunk,
    updateSubredditThunk,
    deleteSubredditThunk,
    userJoinSubredditThunk,
    userLeaveSubredditThunk,
} from "../../redux/subreddit";

export default function MainPage() {
	const dispatch = useDispatch();
	const [load, setLoad] = useState(false);
    const [reload, setReload] = useState(0)

	const userInfo = {
		email: "demo@user.io",
		password: "password",
	};

	useEffect(() => {
		dispatch(loadSubredditPostsThunk(2)).then(() => setLoad(true));
	}, []);

	const handlePost = () => {
		const body = {
			name: "new subreddit name 4",
            description: "new subreddit description"
		};

		dispatch(userJoinSubredditThunk(1));
	};

	const handlePut = () => {
		const body = {
            subredditId: 1,
            name: "same subreddit name",
            description: "updated subreddit description"
		};

		// dispatch(updateSubredditThunk(body));
        dispatch(userLeaveSubredditThunk(1))
	};

	const test = useSelector((state) => state);
	const subreddit_errors = useSelector((state) => state.subreddit.errors);

	useEffect(() => {
		if (load === true) {
			console.log("booba state", test);
		}
	}, [load, reload]);

	return load ? (
		<div>
			<ErrorHelper errors={subreddit_errors} />
			<section>
				<button onClick={() => dispatch(login(userInfo))}>Login</button>
			</section>
			<section>
				<button onClick={() => dispatch(logout())}>Logout</button>
			</section>
			<section>
				<button onClick={() => handlePost()}>Post</button>
			</section>
			<section>
				<button onClick={() => handlePut()}>Put</button>
			</section>
		</div>
	) : (
		<>not loading fucker</>
	);
}
