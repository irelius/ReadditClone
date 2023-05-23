import * as sessionActions from "../../store/session"
import * as postLikeActions from "../../store/postLike"
import * as commentLikeActions from "../../store/commentLike"

const commentLikeHandler = (comment, dispatch, commentLikeStatus, e) => {
    e.preventDefault()
    e.stopPropagation()

    let likeInfo = {
        like_status: "like"
    }

    if (postLikeStatus === "like") {
        dispatch(postLikeActions.deleteLikePostThunk(post["id"]))
    } else {
        dispatch(postLikeActions.deleteLikePost(post["id"])).then(() => {
            dispatch(postLikeActions.createLikePostThunk(likeInfo, post["id"]))
        })
    }

}

export default commentLikeHandler
