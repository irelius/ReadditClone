import "./TestPage.css"

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as commentActions from "../../store/comment"
import * as postLikeActions from "../../store/postLike"

import TestOne from "./TestPageComponents/TestOne";


const TestPage = () => {
    const dispatch = useDispatch()

    const [state, setState] = useState(false)

    const post_id = 5

    useEffect(() => {
        dispatch(commentActions.loadPostCommentsThunk(post_id))
        dispatch(postLikeActions.loadLikesPostThunk(post_id))
        setState(true)

        return (() => {
            dispatch(commentActions.clearComment())
        })
    }, [dispatch])

    const currentComments = Object.values(useSelector(commentActions.loadAllComments))
    const commentLikes = Object.values(useSelector(postLikeActions.loadPostLikes))[0]

    return state && currentComments.length > 0 ? (
        <div id="testpage">
            {TestOne(dispatch, useState)}
        </div>
    ) : (
        <div></div>
    )
}

export default TestPage
