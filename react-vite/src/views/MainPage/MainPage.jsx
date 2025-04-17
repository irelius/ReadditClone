import "./MainPage.css";

import Modal from "../../components/Modals";
import { useState } from "react";

import ReactDOM from "react-dom";
import SignUpForm from "../../components/Modals/SignUpModal/SignUpForm";
import LoginForm from "../../components/Modals/LoginModal/LoginForm";

export default function MainPage() {
	const [openModal, setOpenModal] = useState(false);

	return (
		<div>
			<button onClick={() => setOpenModal(true)}>show modal</button>
			<Modal
				className="test-class"
				isOpen={openModal}
				keepOpen={setOpenModal}
				children={<LoginForm keepOpen={setOpenModal} />}
			/>
		</div>
	);
}
