import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { ModalProvider, Modal } from "../context/Modal";
// import Navigation from "../components/Navigation/Navigation";

import { authenticate } from "./redux/session";
import MainPage from "./views/MainPage";
import NavBar from "./components/NavBar";
import SignUpForm from "./components/Modals/SignUpModal/SignUpForm";

export default function App() {
	const dispatch = useDispatch();
	const [load, setLoad] = useState(false);

	useEffect(() => {
		dispatch(authenticate()).then(() => setLoad(true));
	}, [dispatch]);

	return (
		load && (
			<>
				{/* <NavBar /> */}
				{/* <Navigation /> */}
				<Routes>
					<Route exact path="/" element={<MainPage />} />
				</Routes>
				<Routes>
					<Route exact path="/test" element={<SignUpForm />} />
				</Routes>
			</>
		)
	);
}
