import { useLocation, useParams, useSearchParams } from "react-router-dom";
import "./TestPage.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadPostThunk } from "../../redux/post";

export default function TestPage() {
    const dispatch = useDispatch()
	const params = useParams();
    const [test, setTest] = useState(false)

    useEffect(() => {
        dispatch(loadPostThunk(1))
    }, [])

    const post = useSelector(state => state.post.posts[1])

    useEffect(() => {
        if(post) {
            setTest(post.body)
        }
    }, [post])

	return (
		<div className="font-white">
            test page
		</div>
	);
}
