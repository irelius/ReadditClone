import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { ModalProvider, Modal } from "../context/Modal";
// import Navigation from "../components/Navigation/Navigation";

import { authenticate  } from "./redux/session";
import MainPage from "./views/MainPage";

export default function App() {
	const dispatch = useDispatch();
	const [load, setLoad] = useState(false);

	useEffect(() => {
		dispatch(authenticate()).then(() => setLoad(true));
	}, [dispatch]);
    
	return (
		load && (
			<>
				{/* <Navigation /> */}
				<Routes>
					<Route exact path="/comments/:commentId" element={<MainPage />} />
				</Routes>
			</>
		)
	);
}
