import "./Modal.css";
import ReactDOM from "react-dom";

export default function Modal({ isOpen, onClose, children }) {
	if (!isOpen) return null;

	return ReactDOM.createPortal(
		<div className="modal-background">
			<div className="modal-class">
				{/* <section onClick={() => onClose(false)}>XXX</section> */}
				{children}
			</div>
		</div>,
		document.getElementById("modal")
	);
}
