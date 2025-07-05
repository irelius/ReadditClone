import { useNavigate } from "react-router-dom";
import "./CreateSubredditModal.css";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { createSubredditThunk } from "../../../redux/subreddit";
import errorSetter from "../../../helper/error";

export default function CreateSubredditModal({ isOpen, keepOpen, currUser }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [subredditName, setSubredditName] = useState("");
	const [subredditDescription, setSubredditDescription] = useState("");
	const [subredditDescriptionLength, setSubbredditDescriptionLength] = useState(0);
	const [errors, setErrors] = useState({
		name: [],
		description: [],
	});
    
	if (!isOpen) return null;


	const createSubreddit = async (e) => {
		e.preventDefault();

		let subredditInfo = {
			name: subredditName.trim().split(" ").join("_"),
			description: subredditDescription,
		};

		dispatch(createSubredditThunk(subredditInfo)).then((res) => {
			errorSetter(res, setErrors);
			if (res.type === "CREATE_SUBREDDIT") {
				keepOpen(false);
                return navigate(`/r/${subredditName}`)
			}
		});
	};

	return (
		<form onSubmit={(e) => createSubreddit(e)} className="subreddit-modal-main-container">
			<section className="header-container-main-container">
				<aside className="header-title-container">
					<section className="header-title">Create a community</section>
				</aside>
				<aside className="header-exit-container">
					<button
						className="header-exit-button"
						onClick={() => {
							keepOpen(false);
						}}>
						<i className="header-exit-icon fa-solid fa-xmark fa-lg"></i>
					</button>
				</aside>
			</section>
			<section className="header-name-container">
				<section className="header-name">Name</section>
				<section className="header-warning">Community names including capitalization cannot be changed.</section>
			</section>
			<section className="subreddit-name-input-main-container">
				<aside className="subreddit-name-input-r">r/</aside>
				<input
					className="subreddit-name-input-container"
					name="name"
					type="text"
					minLength={1}
					maxLength={21}
					value={subredditName}
					onChange={(e) => {
						setSubredditName(e.target.value);
						setSubbredditDescriptionLength(e.target.value.length);
					}}
				/>
			</section>
			<section className="header-characters-remaining-container">
				<section className="header-characters-remaining">
					{21 - subredditDescriptionLength} characters remaining
				</section>
			</section>
			<div className="header-error-container">
				{errors.name && errors.name.map((error, i) => <div key={i}>{error}</div>)}
			</div>
			<section className="header-description-container">
				<section className="header-description">Description (Optional)</section>
				<section className="header-warning">Give your community a description. This can be changed later.</section>
			</section>
			<section className="subreddit-description-input-main-container">
				<textarea
					className="subreddit-description-input"
					name="description"
					type="text"
					maxLength={500}
					value={subredditDescription}
					onChange={(e) => setSubredditDescription(e.target.value)}
				/>
			</section>
			<div className="header-error-container">
				{errors.description && errors.description.map((error, i) => <div key={i}>{error}</div>)}
			</div>
			<section className="footer-container">
				<button
					className="footer-cancel-button"
					onClick={() => {
						keepOpen(false);
					}}>
					Cancel
				</button>
				<button className="footer-create-subreddit-button" type="submit">
					Create Community
				</button>
			</section>
		</form>
	);
}
