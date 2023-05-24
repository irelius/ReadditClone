const modifyCommentLikeTotal = (comment, initialCommentLikes, modifiedCommentLikes) => {

    // console.log('booba test', comment.id, initialCommentLikes, modifiedCommentLikes)

    if (initialCommentLikes[comment["id"]] === "like" && modifiedCommentLikes[comment["id"]] === "neutral") {
        return -1
    }
    if (initialCommentLikes[comment["id"]] === "like" && modifiedCommentLikes[comment["id"]] === "dislike") {
        return -2
    }
    if (initialCommentLikes[comment["id"]] === "like" && modifiedCommentLikes[comment["id"]] === "like") {
        return 0
    }

    if (initialCommentLikes[comment["id"]] === "dislike" && modifiedCommentLikes[comment["id"]] === "neutral") {
        return 1
    }
    if (initialCommentLikes[comment["id"]] === "dislike" && modifiedCommentLikes[comment["id"]] === "like") {
        return 2
    }
    if (initialCommentLikes[comment["id"]] === "dislike" && modifiedCommentLikes[comment["id"]] === "dislike") {
        return 0
    }

    if (modifiedCommentLikes[comment["id"]] === "like") {
        return 1
    }
    if (modifiedCommentLikes[comment["id"]] === "dislike") {
        return -1
    }

    return 0
}

export default modifyCommentLikeTotal;
