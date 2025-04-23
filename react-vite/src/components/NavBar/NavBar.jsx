import "./NavBar.css";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import ProfileButton from "../Modals/ProfileButton";
import { logout } from "../../redux/session";
import Modal from "../Modals/Modal";
import LoginForm from "../Modals/LoginModal/LoginForm";
import SignUpForm from "../Modals/SignUpModal/SignUpForm";
import ProfileDropDown from "../Modals/ProfileDropDown/ProfileDropDown";

const NavBar = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [currUser, setCurrUser] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [openSignupModal, setOpenSignupModal] = useState(false);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [openProfileMenu, setOpenProfileMenu] = useState(false);

	const session = useSelector((state) => state.session);

	useEffect(() => {
		if (session.loggedIn === true) {
			setCurrUser(session.user);
		} else {
            setCurrUser(null)
        }
	}, [session]);

    const profileDropdownStyle = {
        "background-color": "transparent"
    }

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
							}}>
							<i className="navbar-github-icon fa-brands fa-github fa-lg" />
						</section>
						<section
							className="navbar-about-links-linkedin"
							onClick={() => {
								return window.open("https://www.linkedin.com/in/sbkihongbae/");
							}}>
							<i className="navbar-linked-icon fa-brands fa-linkedin fa-lg" />
						</section>
					</aside>
				</section>
				{/* TO DO: Drop down menu to select Home, Popular, or specific Subreddit communities */}
			</div>

			<section className="navbar-middle">
				<section className="navbar-search-bar-container">
					<form
						onSubmit={() => {
							if (searchInput === "") return;
							return navigate("/");
						}}>
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

			{currUser ? (
				<div>
					<section
						onClick={() => {
							dispatch(logout());
							setOpenLoginModal(false);
							setOpenSignupModal(false);
						}}>
						logout
					</section>
					<div className="navbar-profile-main-container">
						<section className="navbar-profile-menu-container">
							<button className="navbar-profile-menu-button" onClick={() => setOpenProfileMenu((prev) => !prev)}>
								<aside>
									<aside className="navbar-profile-menu-profile-pic-container">
										<img
											className="navbar-profile-menu-profile-pic"
											src={currUser.profile_image}
											width={30}
											height={30}
											alt="profile image"
										/>
									</aside>
									<aside className="navbar-profile-menu-name">{currUser.username}</aside>
								</aside>
								<aside className="navbar-profile-menu-arrow">
									<i className="fa-solid fa-angle-down"></i>
								</aside>
							</button>
						</section>
					</div>
					<Modal optionalStyle={profileDropdownStyle} isOpen={openProfileMenu} keepOpen={setOpenProfileMenu}>
						<ProfileDropDown isOpen={openProfileMenu} keepOpen={setOpenProfileMenu} currUser={currUser}/>
					</Modal>
				</div>
			) : (
				<div className="navbar-right">
					<aside className="navbar-right-button-signup">
						<button onClick={() => setOpenSignupModal(true)}>Signup</button>
						<Modal isOpen={openSignupModal} keepOpen={setOpenSignupModal}>
							<SignUpForm currUser={currUser} keepOpen={setOpenSignupModal} />
						</Modal>
					</aside>
					<aside className="navbar-right-button-login">
						<button onClick={() => setOpenLoginModal(true)}>Login</button>
						<Modal isOpen={openLoginModal} keepOpen={setOpenLoginModal}>
							<LoginForm currUser={currUser} keepOpen={setOpenLoginModal} />
						</Modal>
					</aside>
					{/* <aside className="navbar-right-button-signup">
						<button onClick={() => setOpenProfileMenu(true)}>Test</button>
						<Modal isOpen={openProfileMenu} keepOpen={setOpenProfileMenu}>
							<ProfileDropDown isOpen={openProfileMenu} keepOpen={setOpenProfileMenu} currUser={currUser} />
						</Modal>
					</aside> */}
				</div>
			)}
		</div>
	);
};

export default NavBar;
