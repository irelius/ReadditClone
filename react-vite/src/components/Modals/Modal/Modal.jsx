import "./Modal.css";
import ReactDOM from "react-dom";

export default function Modal({ optionalStyle, isOpen, keepOpen, children }) {
	if (!isOpen) return null;

	return ReactDOM.createPortal(
		<div
			style={optionalStyle}
			className="modal-background"
			onClick={() => {
				console.log("booba", children);
				keepOpen(false);
			}}>
			<div className="modal-class" onClick={(e) => e.stopPropagation()}>
				{children}
			</div>
		</div>,
		document.getElementById("modal")
	);
}
