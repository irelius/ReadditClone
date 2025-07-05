import "./ProfileButton.css";

// import ProfileDropDown from "../../react-vite/src/components/Modals/ProfileDropDown/ProfileDropDown";
// import { useState } from "react";

const ProfileButton = ({ currUser }) => {
    return (
        <div>profile button back up</div>
    )
	// const [openProfileMenu, setOpenProfileMenu] = useState(false);

	// return (
	// 	<div className="navbar-profile-main-container">
	// 		<section className="navbar-profile-menu-container">
	// 			<button className="navbar-profile-menu-button" onClick={() => setOpenProfileMenu((prev) => !prev)}>
	// 				<aside>
	// 					<aside className="navbar-profile-menu-profile-pic-container">
	// 						<img
	// 							className="navbar-profile-menu-profile-pic"
	// 							src={currUser.profile_image}
	// 							width={30}
	// 							height={30}
	// 							alt="profile image"
	// 						/>
	// 					</aside>
	// 					<aside className="navbar-profile-menu-name">{currUser.username}</aside>
	// 				</aside>
	// 				<aside className="navbar-profile-menu-arrow">
	// 					<i className="fa-solid fa-angle-down"></i>
	// 				</aside>
	// 			</button>
	// 		</section>
	// 		{/* <Modal isOpen={openProfileMenu} keepOpen={setOpenProfileMenu} children={<ProfileDropDown />} /> */}
	// 		{/* <ProfileDropDown isOpen={openProfileMenu} keepOpen={setOpenProfileMenu} /> */}
	// 		<ProfileDropDown isOpen={openProfileMenu} keepOpen={setOpenProfileMenu} />
	// 	</div>
	// );
};

export default ProfileButton;
