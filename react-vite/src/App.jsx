import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { ModalProvider, Modal } from "../context/Modal";
// import Navigation from "../components/Navigation/Navigation";

import { authenticate  } from "./redux/session";
import MainPage from "./views/MainPage";

export default function App() {
	const dispatch = useDispatch();
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		dispatch(authenticate()).then(() => setIsLoaded(true));
	}, [dispatch]);
    
	return (
		isLoaded && (
			<>
				{/* <Navigation /> */}
				<Routes>
					<Route exact path="/" element={<MainPage />} />
				</Routes>
			</>
		)
	);
}
