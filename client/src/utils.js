import axios from "axios";
import jwt_decode from "jwt-decode";
import Alert from 'react-bootstrap/Alert';

export function check_token() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login";
    }
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const decodedToken = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
        localStorage.clear();
        location.href = "/login";
    }

    return config;
}

export function like(postId) {
    const likeCount = document.getElementById(`likes-count-${postId}`);
    const likeButton = document.getElementById(`like-button-${postId}`);
    const token = check_token();

    axios
        .post(`/like_post/${postId}`, {}, token)
        .then((res) => {
            // console.log(res);
            likeCount.innerHTML = res.data[`likes`];
            if (res.data[`error`] == "Access denied") {
                alert("You are not allowed to do this operation");
                return;
            }
            if (res.data[`likes`] == true) {
                likeButton.className = "fas fa-thumbs-up";
            } else {
                likeButton.className = "far fa-thumbs-up";
            }
        })
        .catch((e) => console.log(e));
}

export function deleteArticle(postId) {
    const token = check_token();
    return new Promise((resolve, reject) => {
        axios
        .delete(`/post/delete/${postId}`, token)
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
    const token = check_token();

    axios
        .put(`/admin/block_user/${id}`, {}, token)
        .then((res) => {
            if (res.data.operation == "Un-Blocked") {
                showOpt.innerHTML = "Block";
            } else {
                showOpt.innerHTML = "Un-Block";
            }
        })
        .catch((err) => console.log(err.response));
}
