import "./MainPage.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import ErrorHelper from "../../components/ErrorHelper/ErrorHelper";

import { login } from "../../redux/session";
import { loadAllUserThunk } from "../../redux/user";
import { createPostThunk, deletePostThunk, loadPostsThunk, putPostThunk } from "../../redux/post";

export default function MainPage() {
	const dispatch = useDispatch();
	const [load, setLoad] = useState(false);

	useEffect(() => {
		setLoad(true);
		dispatch(loadPostsThunk());
	}, []);
	const subreddit_errors = useSelector((state) => state.subreddit.errors);

	const test = useSelector((state) => state.post);
	// console.log('booba', test)

	const handleCreate = () => {
		dispatch(
			login({
				email: "demo@user.io",
				password: "password",
			})
		);

		const body = {
			subreddit_id: 1,
			title: "test post title",
			body: "test post body 3",
		};

		dispatch(loadAllUserThunk());
	};

	return load ? (
		<div>
			{/* <section>
				<button onClick={() => dispatch(logout())}>logout</button>
			</section> */}
			<section>
				<button onClick={() => handleCreate()}>Test Thunk</button>
			</section>
			<ErrorHelper errors={subreddit_errors} />
		</div>
	) : (
		<>not loading fucker</>
	);
}
