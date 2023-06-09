import "./CreatePostPage.css"

import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as subredditActions from "../../store/subreddit"
import * as postActions from "../../store/post"

import redirectToSubredditPage from "../HelperFunctions/redirectToSubredditPage"

const CreatePostPage = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    const [load, setLoad] = useState(false)
    const [errors, setErrors] = useState([])
    const [postTitle, setPostTitle] = useState("")
    const [postBody, setPostBody] = useState("")
    const [postImage, setPostImage] = useState(null)
    const [uploadImage, setUploadImage] = useState(false)
    // const [postVideo, setPostVideo] = useState(null)
    // const [uploadVideo, setUploadVideo] = useState(false)


    useEffect(() => {
        const currentSubredditName = window.location.href.split("/")[4]
        dispatch(subredditActions.loadCurrentSubredditThunk(currentSubredditName))
        setLoad(true)
        return () => dispatch(subredditActions.clearSubreddit())
    }, [dispatch])

    const currentSubreddit = Object.values(useSelector(subredditActions.loadAllSubreddit))

    // Creating Post Handler Function
    const createPost = async (e) => {
        e.preventDefault();

        const currentSubredditInfo = Object.values(currentSubreddit[0])[0]

        let postInfo = {
            subreddit_id: currentSubredditInfo.id,
            title: postTitle,
            body: postBody,
        }

        const formData = new FormData()
        formData.append('image', postImage);

        const data = await dispatch(postActions.createPostThunk(postInfo))
        if (data["id"]) {
            await fetch(`/api/images/new/${data["id"]}`, {
                method: "POST",
                body: formData,
            });

            return history.push(`/r/${currentSubredditInfo.name}`)
        } else {
            setErrors(data)
        }
    }

    const updateImage = (e) => {
        const file = e.target.files[0]
        setPostImage(file)
    }


    const loadCreatePostForm = () => {
        const currentSubredditInfo = Object.values(currentSubreddit[0])[0]
        let subredditDate = currentSubredditInfo.created_at.split(" ")
        subredditDate = subredditDate[2] + " " + subredditDate[1] + ", " + subredditDate[3]

        return (
            <div id="create-post-page-main-container">
                <aside id="create-post-container">
                    <section id="create-post-header-container">
                        <aside id="create-post-header">
                            Create a post for r/{currentSubredditInfo.name}
                        </aside>
                    </section>
                    <section id="create-post-form-container">
                        <form onSubmit={createPost} id="create-post-form">
                            <section id="create-post-form-title-container">
                                <input id="create-post-form-title"
                                    name="title"
                                    type="text"
                                    placeholder="Title"
                                    minLength={1}
                                    maxLength={300}
                                    value={postTitle}
                                    onChange={(e) => setPostTitle(e.target.value)}
                                />
                                <aside id="create-post-form-title-counter">
                                    {postTitle.length}/300
                                </aside>
                            </section>
                            <section id="create-post-form-body-container">
                                <textarea id="create-post-form-body"
                                    name="body"
                                    type="text"
                                    placeholder="Text (optional)"
                                    value={postBody}
                                    onChange={(e) => setPostBody(e.target.value)}
                                />
                                {uploadImage ? (
                                    <section id="create-post-form-image-upload-container">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={updateImage}
                                        ></input>
                                    </section>
                                ) : (
                                    <div className="nothing"></div>
                                )}
                            </section>
                            <section id="create-post-form-button-container">
                                <aside id="create-post-error-container">
                                    {errors.map((error, ind) => (
                                        <div key={ind}>{error}</div>
                                    ))}
                                </aside>
                                <button onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setUploadImage(true)
                                }} id="create-post-upload-image">
                                    Upload Image
                                </button>
                                <button type="submit" id="create-post-form-button">
                                    Post
                                </button>
                            </section>
                        </form>
                    </section>
                </aside>
                <aside onClick={(e) => redirectToSubredditPage(currentSubredditInfo["name"], history, e)} id="create-post-bar-main-container">
                    <section id="create-post-bar-banner">
                    </section>
                    <section id="create-post-bar-header-container">
                        <aside id="subreddit-bar-icon">
                            r/
                        </aside>
                        <aside id="subreddit-bar-header">
                            r/{currentSubredditInfo.name}
                        </aside>
                    </section>
                    <section id="subreddit-bar-details-container">
                        <section id="subreddit-bar-details-body">
                            {currentSubredditInfo.description}
                        </section>
                        <section id="subreddit-bar-date">
                            Created {subredditDate}
                        </section>
                    </section>
                    {/* TO DO: details about the subreddit like member count? */}
                    {/* <section >
                    </section> */}
                </aside>
            </div>
        )
    }


    return currentSubreddit.length > 0 && load ? (
        <div>
            {loadCreatePostForm()}
        </div>
    ) : (
        <div></div>
    )
}

export default CreatePostPage;
