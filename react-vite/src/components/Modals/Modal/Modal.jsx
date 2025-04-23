import "./Modal.css";
import ReactDOM from "react-dom";

export default function Modal({ isOpen, keepOpen, children }) {
	if (!isOpen) return null;

	return ReactDOM.createPortal(
		<div className="modal-background" onClick={() => keepOpen(false)}>
			<div className="modal-class" onClick={(e) => e.stopPropagation()}>
				{children}
			</div>
		</div>,
		document.getElementById("modal")
	);
}
