import "./NavBarProfileMenu.css";

// import ProfileMenuModal from "../../../Modals/ProfileMenuModal/ProfileMenuModal";
// import { Modal } from "../../../../context/Modal";
import Modal from "../../Modals/Modal";
import { useState } from "react";
import { useSelector } from "react-redux";

const NavBarProfileMenu = () => {
	const [showProfileMenu, setShowProfileMenu] = useState(false);

	const currentUser = useSelector((state) => state.session.user);

	return (
		<div className="navbar-profile-main-container">
			<section className="navbar-profile-menu-container">
				<button className="navbar-profile-menu-button" onClick={() => setShowProfileMenu(true)}>
					<aside>
						<aside className="navbar-profile-menu-profile-pic-container">
							<img
								className="navbar-profile-menu-profile-pic"
								src={currentUser.profile_image}
								width={30}
								height={30}
								alt="profile image"
							/>
						</aside>
						<aside className="navbar-profile-menu-name">{currentUser.username}</aside>
					</aside>
					<aside className="navbar-profile-menu-arrow">
						<i className="fa-solid fa-angle-down"></i>
					</aside>
				</button>
			</section>
			<Modal isOpen={showProfileMenu} keepOpen={setShowProfileMenu}>
				asdf
				{/* <ProfileMenuModal setShowProfileMenu={setShowProfileMenu}/> */}
			</Modal>
		</div>
	);
};

export default NavBarProfileMenu;
