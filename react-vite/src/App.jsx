import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { ModalProvider, Modal } from "../context/Modal";

import { authenticate } from "./redux/session";
import MainPage from "./views/MainPage";
import NavBar from "./components/NavBar";
import TestPage from "./views/TestPage";
import PostPage from "./views/PostPage/PostPage";
// import SignUpForm from "./components/Modals/SignUpModal/SignUpForm";

export default function App() {
	const dispatch = useDispatch();
	const [load, setLoad] = useState(false);

	useEffect(() => {
		dispatch(authenticate()).then(() => {
			setLoad(true);
		});
	}, [dispatch]);

	return (
		load && (
			<>
				<NavBar />
				<div className="navbar-height-correction">
					<Routes>
						<Route exact path="/" element={<MainPage />} />
						<Route exact path="/test" element={<TestPage />} />
						<Route exact path="/r/:subredditName/:postId" element={<PostPage />} />
                        <Route path="/search/:searchTerm" element={<TestPage />} />
					</Routes>
				</div>
			</>
		)
	);
}
