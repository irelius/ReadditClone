import "./LandingPage.css"

import PostsAll from "../PostsAll";
import SubredditsBar from "../SubredditsBar/SubredditsBar";

const LandingPage = () => {
    return (
        <div id="landing-page-main-container">
            <aside id="landing-page-posts-container">
                <PostsAll />
            </aside>
            <aside id="landing-page-subreddit-bar-container">
                <SubredditsBar />
            </aside>
            <section id="landing-page-bottom-right">
                <button id="to-the-top-button" onClick={() => window.scrollTo(0,0)}>
                    To the Top
                </button>
                <a id="my-linkedin" href="https://www.linkedin.com/in/sbkihongbae/">LinkedIn</a>
                <a id="my-github" href="https://github.com/irelius">GitHub</a>
            </section>
        </div>
    )
}

export default LandingPage
