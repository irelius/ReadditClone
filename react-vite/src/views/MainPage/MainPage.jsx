import "./MainPage.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import ErrorHelper from "../../components/ErrorHelper/ErrorHelper";
import { deleteSubredditThunk, updateSubredditThunk } from "../../redux/subreddit";
import { login } from "../../redux/session";

export default function MainPage() {
	const dispatch = useDispatch();
	const [load, setLoad] = useState(false);
    
	useEffect(() => {
        setLoad(true);
        dispatch(login({
            "email": "demo@user.io",
            "password": "password"
        }))
		// dispatch(loadSubredditThunk(999));
	}, []);
    const subreddit_errors = useSelector((state) => state.subreddit.errors);

	const test = useSelector((state) => state.subreddit);
    console.log('booba', test)

    const handleCreate = () => {
        const body = {
            subredditId: 1
        }

        dispatch(deleteSubredditThunk(2))
    }

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
