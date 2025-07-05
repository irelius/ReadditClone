import "./ProfileDropDown.css";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../redux/session";
import Modal from "../Modal";
import CreateSubredditModal from "../CreateSubredditModal";
// import SubredditCreateModal from "../SubredditCreateModal";

const ProfileDropDown = ({ isOpen, keepOpen, currUser }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [openCreateSubredditModal, setOpenCreateSubredditModal] = useState(false);

	if (!isOpen) return null;

	// Redirect to User's Profile page
	const profileRedirect = (e) => {
		e.preventDefault();
		keepOpen(false);
		return navigate(`/users/${currUser.username}`);
	};

	// Handle Logout
	const handleLogout = async (e) => {
		e.preventDefault();
		keepOpen(false);
		dispatch(logout());
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
			{/* TODO, implement function to turn on dark mode and not */}
			{/* <section className="li-navbar-right-part-two">
                View Options
                <li>Dark Mode</li>
            </section> */}
			<section
				className="li-navbar-right-part-three"
				onClick={() => {
					setOpenCreateSubredditModal(true);
				}}>
				<aside className="navbar-community-icon">
					<i className="fa-brands fa-ravelry" />
				</aside>
				<aside className="navbar-right-community">
					Create a subreddit
					<Modal isOpen={openCreateSubredditModal} keepOpen={setOpenCreateSubredditModal}>
						<CreateSubredditModal
							isOpen={openCreateSubredditModal}
							currUser={currUser}
							keepOpen={setOpenCreateSubredditModal}
						/>
					</Modal>
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
