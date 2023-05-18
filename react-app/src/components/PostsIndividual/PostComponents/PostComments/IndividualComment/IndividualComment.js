import "./IndividualComment.css"

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import * as postLikeActions from "../../../../../store/postLike"



const IndividualComment = ({commentLikeStatus, setCommentLikeStatus}) => {
    // const commentId = comment.id

    const dispatch = useDispatch()


    {/* <aside id="comment-footer-vote-container">
        <aside onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            // likeHandler
        }}>
            <i className="fa-solid fa-up-long fa-lg" />
        </aside>

        {initialCommentLikeTotal}

        <aside>
            <i className="fa-solid fa-down-long fa-lg" />
        </aside>
    </aside> */}


    return (
        <div onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
        }}>
            individual comment
        </div>
    )
}

export default IndividualComment;
