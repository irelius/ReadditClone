import "./MainPage.css";

import { useEffect, useState } from "react";

import SinglePost from "../../components/SinglePost/SinglePost";
import { useDispatch, useSelector } from "react-redux";
import { loadPostsThunk } from "../../redux/post";
import { loadCurrentUserAllPostLikesThunk } from "../../redux/postLike";

export default function MainPage() {
	const dispatch = useDispatch();

	const [load, setLoad] = useState(false);
	// const [openModal, setOpenModal] = useState(false);

	useEffect(() => {
		const sendDispatches = async () => {
			await dispatch(loadPostsThunk());
			await dispatch(loadCurrentUserAllPostLikesThunk());
		};
		sendDispatches().then(() => {
			setLoad(true);
		});
	}, []);

	const posts = useSelector((state) => state.post.posts);
	const postsById = useSelector((state) => state.post.postsById);
	const userPostLikes = useSelector((state) => state.postLike.likedPosts);

	return (
		load && (
			<div>
				{postsById.map((el) => {
					const likeStatus = el in userPostLikes ? userPostLikes[el].like_status : null;
					return (
						<div key={el}>
							<SinglePost post={posts[el]} likeStatus={likeStatus} />
							<section className="post-border" />
						</div>
					);
				})}
			</div>
		)
	);
}
