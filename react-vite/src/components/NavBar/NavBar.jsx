import "./NavBar.css";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

// import NavBarProfileMenu from "./NavBarComponents/NavBarProfileMenu/NavBarProfileMenu";
import NavBarProfileMenu from "./NavBarProfileMenu/NavBarProfileMenu";
import SignUpFormModal from "../SignupFormModal";
import { logout } from "../../redux/session";
import Modal from "../Modals";
import LoginForm from "../Modals/LoginModal/LoginForm";
import SignUpForm from "../Modals/SignUpModal/SignUpForm";
// import LoginModal from "../Modals/LoginModal";
// import SignUpFormModal from "../Modals/SignUpModal";

const NavBar = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// const [currUserId, setCurrUserId] = useState()
	const [currUser, setCurrUser] = useState();

	const session = useSelector((state) => state.session);

	useEffect(() => {
		if (session.loggedIn === true) {
			// setCurrUserId(session.user.id)
			setCurrUser(session.user);
		}
	}, [session]);

	const [searchInput, setSearchInput] = useState("");
	const [openSignupModal, setOpenSignupModal] = useState(false);
	const [openLoginModal, setOpenLoginModal] = useState(false);

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

			{session.loggedIn === true ? (
				<div>
					<section
						onClick={() => {
							dispatch(logout());
                            setOpenLoginModal(false)
                            setOpenSignupModal(false)
						}}
					>
						booba
					</section>
					{/* <NavBarProfileMenu /> */}
					{/* NVProfileMenu */}
				</div>
			) : (
				<div className="navbar-right">
					<aside className="navbar-right-button-signup">
						<button onClick={() => setOpenSignupModal(true)}>Signup</button>
						{/* <SignUpFormModal currUser={currUser} /> */}
						<Modal
							className="test-class"
							isOpen={openSignupModal}
							keepOpen={setOpenSignupModal}
							children={<SignUpForm currUser={currUser} keepOpen={setOpenSignupModal} />}
						/>
					</aside>
					<aside className="navbar-right-button-login">
						{/* <LoginModal currUser={currUser} /> */}
						<button onClick={() => setOpenLoginModal(true)}>Login</button>
						<Modal
							className="test-class"
							isOpen={openLoginModal}
							keepOpen={setOpenLoginModal}
							children={<LoginForm currUser={currUser} keepOpen={setOpenLoginModal} />}
						/>
					</aside>
				</div>
			)}
		</div>
	);
};

export default NavBar;
