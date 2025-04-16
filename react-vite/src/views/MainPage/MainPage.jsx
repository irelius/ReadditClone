import "./MainPage.css";

import Modal from "../../components/Modals";
import { useState } from "react";

import ReactDOM from "react-dom";
import SignUpForm from "../../components/Modals/SignUpModal/SignUpForm";

export default function MainPage() {
	const [openModal, setOpenModal] = useState(false);

	return (
		<div>
			<button onClick={() => setOpenModal(true)}>show modal</button>
			<Modal
				className="test-class"
				isOpen={openModal}
				onClose={setOpenModal}
				children={<SignUpForm onClose={setOpenModal} />}
			/>
		</div>
	);
}
