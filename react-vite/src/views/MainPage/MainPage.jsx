import "./MainPage.css";

import Modal from "../../components/Modals/Modal";
import { useEffect, useState } from "react";

// import ReactDOM from "react-dom";
// import SignUpForm from "../../components/Modals/SignUpModal/SignUpForm";
import LoginForm from "../../components/Modals/LoginModal/LoginForm";
import SinglePost from "../../components/SinglePost/SinglePost";
import { useDispatch, useSelector } from "react-redux";
import { loadPostsThunk } from "../../redux/post";

export default function MainPage() {
	const dispatch = useDispatch();

	const [load, setLoad] = useState(false);
	const [openModal, setOpenModal] = useState(false);

	useEffect(() => {
		dispatch(loadPostsThunk());
		setLoad(true);
	}, []);

	const posts = useSelector((state) => state.post.posts);
	const postsById = useSelector((state) => state.post.postsById);

	return load ? (
		<div className="asdf">
			{postsById.map((el, i) => {
				return <SinglePost post={posts[el]} key={i} />;
			})}
			{/* <button onClick={() => setOpenModal(true)}>show modal</button>
			<Modal isOpen={openModal} keepOpen={setOpenModal}>
				<LoginForm keepOpen={setOpenModal} />
			</Modal> */}
		</div>
	) : (
		<></>
	);
}
