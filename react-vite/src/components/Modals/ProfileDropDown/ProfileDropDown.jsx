import "./ProfileDropDown.css";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import SubredditCreateModal from "../SubredditCreateModal";
import { logout } from "../../../redux/session";
import ReactDom from "react-dom";

const ProfileDropDown = ({ isOpen, keepOpen }) => {
	if (!isOpen) {
		return null;
	}

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const currentUser = useSelector((state) => state.session.user);

	// Redirect to User's Profile page
	const profileRedirect = (e) => {
		e.preventDefault();
		keepOpen(false);
		return navigate(`/users/${currentUser.username}`);
	};

	// Handle Logout
	const handleLogout = async (e) => {
		e.preventDefault();
		dispatch(logout());
		return window.location.reload();
	};

	return (
		<div className="li-navbar-right">
			<section className="li-navbar-right-part-one">
				<aside className="navbar-profile-icon">
					<i className="fa-regular fa-user" />
				</aside>
				<aside className="navbar-profile-name">My Stuff</aside>
			</section>
			<section className="navbar-right-profile" onClick={(e) => profileRedirect(e)}>
				Profile
			</section>
			{/* TO DO, implement function to turn on dark mode and not */}
			{/* <section className="li-navbar-right-part-two">
                View Options
                <li>Dark Mode</li>
            </section> */}
			<section className="li-navbar-right-part-three">
				<aside className="navbar-community-icon">
					<i className="fa-brands fa-ravelry" />
				</aside>
				<aside className="navbar-right-community">
					temp create subreddit modal
					{/* <SubredditCreateModal keepOpen={keepOpen} /> */}
				</aside>
			</section>
			<section className="li-navbar-right-part-four" onClick={(e) => handleLogout(e)}>
				<aside className="navbar-logout-icon">
					<i className="fa-solid fa-arrow-right-from-bracket" />
				</aside>
				<aside className="navbar-right-logout">Logout</aside>
			</section>
			<section className="li-navbar-footer">2022 Readdit.</section>
		</div>
	);
};

export default ProfileDropDown;
