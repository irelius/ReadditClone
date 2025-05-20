import "./MainPage.css";

import Modal from "../../components/Modals/Modal";
import { useEffect, useState } from "react";

// import ReactDOM from "react-dom";
// import SignUpForm from "../../components/Modals/SignUpModal/SignUpForm";
import LoginForm from "../../components/Modals/LoginModal/LoginForm";
import SinglePost from "../../components/SinglePost/SinglePost";
import { useDispatch, useSelector } from "react-redux";
import { loadPostsThunk } from "../../redux/post";
import { loadCurrentUserAllPostLikesThunk } from "../../redux/postLike";

export default function MainPage() {
	const dispatch = useDispatch();

	const [load, setLoad] = useState(false);
	const [openModal, setOpenModal] = useState(false);

	useEffect(() => {
		dispatch(loadPostsThunk());
		dispatch(loadCurrentUserAllPostLikesThunk());
		setLoad(true);
	}, []);

	const posts = useSelector((state) => state.post.posts);
	const postsById = useSelector((state) => state.post.postsById);
	const userPostLikes = useSelector((state) => state.postLikes);

	return load ? (
		<div>
			{postsById.map((el, i) => {
				return <SinglePost post={posts[el]} likeStatus={userPostLikes.likedPosts[el]} key={i} />;
			})}
		</div>
	) : (
		<></>
	);
}
