import "./NavBar.css";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

// import NavBarProfileMenu from "./NavBarComponents/NavBarProfileMenu/NavBarProfileMenu";
import NavBarProfileMenu from "./NavBarProfileMenu/NavBarProfileMenu"
import SignUpFormModal from "../SignupFormModal"
// import LoginModal from "../Modals/LoginModal";
// import SignUpFormModal from "../Modals/SignUpModal";

const NavBar = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const loggedIn = useSelector((state) => state);
	const currUserId = useSelector((state) => state.session.user.users_by_id[0]);
	const currUser = useSelector((state) => state.session.user.all_users[currUserId]);

	const [searchInput, setSearchInput] = useState("");

	return (
		<div className="navbar-main-container">
			<div className="navbar-left-section">
				<Link to="/">
					<section className="navbar-reddit-container">
						<aside className="navbar-reddit-logo-container">
							<i className="navbar-reddit-logo fa-solid fa-glasses" />
						</aside>
						<aside className="navbar-reddit-text">readdit</aside>
					</section>
				</Link>
				<section>
					<aside className="navbar-about-links">
						<section
							className="navbar-about-links-github"
							onClick={() => {
								return window.open("https://github.com/irelius/ReadditClone");
							}}
						>
							<i className="navbar-github-icon fa-brands fa-github fa-lg" />
						</section>
						<section
							className="navbar-about-links-linkedin"
							onClick={() => {
								return window.open("https://www.linkedin.com/in/sbkihongbae/");
							}}
						>
							<i className="navbar-linked-icon fa-brands fa-linkedin fa-lg" />
						</section>
					</aside>
				</section>
				{/* TO DO: Drop down menu to select Home, Popular, or specific Subreddit communities */}
			</div>

			<section className="navbar-middle">
				<section className="navbar-search-bar-container">
					<form
						onSubmit={(e) => {
							if (searchInput === "") return;
							return navigate("/");
						}}
					>
						<input
							className="navbar-search-bar"
							type="text"
							placeholder="Search Readdit"
							onChange={(e) => {
								setSearchInput(e.target.value);
							}}
							name="search"
							minLength={1}
						/>
					</form>
				</section>
			</section>

			{loggedIn ? (
				<div>
					<NavBarProfileMenu />
					{/* NVProfileMenu */}
				</div>
			) : (
				<div className="navbar-right">
					<aside className="navbar-right-button-signup">
						<SignUpFormModal currUser={currUser} />
						{/* signupmodal */}
					</aside>
					<aside className="navbar-right-button-login">
						<LoginModal />
						loginmodal
					</aside>
				</div>
			)}
		</div>
	);
};

export default NavBar;
