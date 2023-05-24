const calculateCommentLikes = (comment) => {

    let likes = Object.values(comment.comment_likes).length
    let dislikes = Object.values(comment.comment_dislikes).length

    return likes - dislikes
}

export default calculateCommentLikes;

// test
