import axios from "axios";
import jwt_decode from "jwt-decode";

export function check_token() {
    const token = localStorage.getItem("token", null);
    if (!token) {
        return {'config': null, "error": "You haven\'t logged in"};
    }
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const decodedToken = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
        localStorage.clear();
        return {"config": null, "error": "Session expired, Please login"};
    }
    return {"config": config, "error": null};
}

export function like(postId) {
    const likeCount = document.getElementById(`likes-count-${postId}`);
    const likeButton = document.getElementById(`like-button-${postId}`);
    const {config} = check_token();

    return new Promise((resolve, reject) => {
        axios
        .post(`/like_post/${postId}`, {}, config)
        .then((res) => {
            // console.log(res);
            likeCount.innerHTML = res.data[`likes`];
            if (res.data[`likes`] == true) {
                likeButton.className = "fas fa-thumbs-up";
            } else {
                likeButton.className = "far fa-thumbs-up";
            }
        })
        .catch((e) => {
            // console.log(e)
            if(e.response.status === 403){
                // alert(e.response.data.error)
                reject(e)
            }
        });
    })
}

export function deleteArticle(postId) {
    const {config} = check_token();
    return new Promise((resolve, reject) => {
        axios
        .delete(`/post/delete/${postId}`, config)
        .then((res) => {
            resolve(res.data);
        })
        .catch((err) => {
            console.log(err);
            reject(err);
        });
    })
}

export function deleteComment(commentId) {
    const token = check_token();
    return new Promise((resolve, reject) => {
        axios
        .delete(`/delete_comment/${commentId}`, token)
        .then((response) => {
            resolve(response.data);
        })
        .catch((error) => {
            // console.log(error);
            reject(error)
        });
    })
}

export function blockUser(id) {
    const showOpt = document.getElementById(`block-option-${id}`);
    const {config} = check_token();

    axios
        .put(`/admin/block_user/${id}`, {}, config)
        .then((res) => {
            if (res.data.operation == "Un-Blocked") {
                showOpt.innerHTML = "Block";
            } else {
                showOpt.innerHTML = "Un-Block";
            }
        })
        .catch((err) => console.log(err.response));
}

export function showCommentInput() {
    const commentField = document.querySelector("#comment-input");
    if (commentField.style.display == "block") {
        commentField.style.display = "none";
    } else {
        commentField.style.display = "block";
    }
}

export function showComments() {
    const allComments = document.querySelector("#show-comments");
    if (allComments.style.display == "block") {
        allComments.style.display = "none";
    } else {
        allComments.style.display = "block";
    }
}