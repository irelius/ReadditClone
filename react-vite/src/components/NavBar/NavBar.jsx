import "./NavBar.css";

import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import Modal from "../Modals/Modal";
import LoginForm from "../Modals/LoginModal/LoginForm";
import SignUpForm from "../Modals/SignUpModal/SignUpForm";
import ProfileDropDown from "../Modals/ProfileDropDown/ProfileDropDown";

const NavBar = () => {
	const navigate = useNavigate();
	const inputRef = useRef(null);

	const [currUser, setCurrUser] = useState(null);
	const [searchInput, setSearchInput] = useState("");
	const [searchInputFocus, setSearchInputFocus] = useState(false);
	const [openSignupModal, setOpenSignupModal] = useState(false);
	const [openLoginModal, setOpenLoginModal] = useState(false);
	const [openProfileMenu, setOpenProfileMenu] = useState(false);
	const [clearInputButton, setClearInputButton] = useState(false);

	const session = useSelector((state) => state.session);

	useEffect(() => {
		if (session.loggedIn === true) {
			setCurrUser(session.user);
		} else {
			setCurrUser(null);
		}
	}, [session]);

	const profileDropdownStyle = {
		backgroundColor: "transparent",
	};

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
					<aside className="navbar-about-links-container">
						<section
							className="navbar-about-links"
							onClick={() => {
								return window.open("https://github.com/irelius/ReadditClone");
							}}>
							<i className="navbar-github-icon fa-brands fa-github fa-lg" />
						</section>
						<section
							className="navbar-about-links"
							onClick={() => {
								return window.open("https://www.linkedin.com/in/sbkihongbae/");
							}}>
							<i className="navbar-linked-icon fa-brands fa-linkedin fa-lg" />
						</section>
						<section
							className="navbar-about-links"
							onClick={() => {
								return window.open("https://samuelbae.netlify.app");
							}}>
							<i className="navbar-linked-icon fa-solid fa-user-tie fa-lg"></i>
						</section>
					</aside>
				</section>
				{/* TO DO: Drop down menu to select Home, Popular, or specific Subreddit communities */}
			</div>

			<section className="navbar-middle">
				<section
					className={`navbar-searchbar-container searchbar-focused-${searchInputFocus}`}
					onClick={() => inputRef.current.focus()}>
					<i className="font-light-gray fa-solid fa-magnifying-glass"></i>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							navigate(`/search/${searchInput}`);
						}}>
						<input
							className="navbar-search-bar font-14"
							type="text"
							name="search"
							placeholder="Search Readdit"
							autoComplete="off"
							minLength={1}
							value={searchInput}
							ref={inputRef}
							onKeyDown={(e) => {
								if (e.key === "Enter" && searchInput.trim().length === 0) {
									e.preventDefault();
								}
							}}
							onChange={(e) => {
								searchInput.length > 0 ? setClearInputButton(true) : setClearInputButton(false);
								setSearchInput(e.target.value);
							}}
							onFocus={() => {
								setSearchInputFocus(true)
							}}
                            onBlur={() => {
                                setSearchInputFocus(false)
                            }}
						/>
					</form>
					<i
						onClick={() => {
							setSearchInput("");
							setClearInputButton(false);
						}}
						className={`show-clear-button-${clearInputButton} pointer fa-regular fa-circle-xmark`}
					/>
				</section>
			</section>

			{currUser ? (
				// Navbar - user logged in
				<div className="navbar-right">
					<section>
						<img
							onClick={() => setOpenProfileMenu((prev) => !prev)}
							className="navbar-profile-image pointer"
							src={currUser.profile_image}
							alt="profile image"
						/>
					</section>
					<Modal optionalStyle={profileDropdownStyle} isOpen={openProfileMenu} keepOpen={setOpenProfileMenu}>
						<ProfileDropDown isOpen={openProfileMenu} keepOpen={setOpenProfileMenu} currUser={currUser} />
					</Modal>
				</div>
			) : (
				// Navbar - user not logged in
				<div className="navbar-right">
					<aside className="navbar-button">
						<button className="navbar-button-signup pointer" onClick={() => setOpenSignupModal(true)}>
							Sign Up
						</button>
						<Modal isOpen={openSignupModal} keepOpen={setOpenSignupModal}>
							<SignUpForm currUser={currUser} keepOpen={setOpenSignupModal} />
						</Modal>
					</aside>
					<aside className="navbar-button">
						<button className="navbar-button-login pointer" onClick={() => setOpenLoginModal(true)}>
							Log In
						</button>
						<Modal isOpen={openLoginModal} keepOpen={setOpenLoginModal}>
							<LoginForm currUser={currUser} keepOpen={setOpenLoginModal} />
						</Modal>
					</aside>
				</div>
			)}
		</div>
	);
};

export default NavBar;
