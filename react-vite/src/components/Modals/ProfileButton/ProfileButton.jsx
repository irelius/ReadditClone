import "./ProfileButton.css";

// import ProfileDropDown from "../../../Modals/ProfileDropDown/ProfileDropDown";
// import { Modal } from "../../../../context/Modal";
// import Modal from "../../Modals/Modal";
import Modal from "../Modal";
import ProfileDropDown from "../ProfileDropDown/ProfileDropDown";
import { useState } from "react";
import { useSelector } from "react-redux";

const ProfileButton = ({ currUser }) => {
	const [openProfileMenu, setOpenProfileMenu] = useState(false);

	return (
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
			{/* <Modal isOpen={openProfileMenu} keepOpen={setOpenProfileMenu} children={<ProfileDropDown />} /> */}
			{/* <ProfileDropDown isOpen={openProfileMenu} keepOpen={setOpenProfileMenu} /> */}
			<ProfileDropDown isOpen={openProfileMenu} keepOpen={setOpenProfileMenu} />
		</div>
	);
};

export default ProfileButton;
