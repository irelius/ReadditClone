import "./Popup.css";
import ReactDOM from "react-dom";

export default function Popup({ isOpen, keepOpen, children }) {
	if (!isOpen) return null;

	return ReactDOM.createPortal(
		<div className="popup-background" onClick={() => keepOpen(false)}>
			<div className="popup-class" onClick={(e) => e.stopPropagation()}>
				{children}
			</div>
		</div>,
		document.getElementById("modal")
	);
}
