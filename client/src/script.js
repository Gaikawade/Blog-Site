import axios from "axios";
import jwt_decode from 'jwt-decode';

export function check_token(){
    const token = localStorage.getItem('token');
    if(!token){
        window.location.href = '/login';
    }
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const decodedToken = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    if(decodedToken.exp < currentTime){
        axios
            .post("/logout", {}, config)
            .then((response) => {
                localStorage.clear();
                navigate("/");
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            });
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
    axios
        .delete(`/post/delete/${postId}`, token)
        .then((res) => {
            // console.log(res.data);
            if (res.data.status === false) {
                alert(res.data.message);
            } else {
                alert(res.data.message);
                window.location.href = "/";
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

export function blockUser(id) {
    const showOpt = document.getElementById(`block-option-${id}`);
    const token = check_token();

    axios
        .put(`/admin/block_user/${id}`, {}, token)
        .then((res) => {
            if(res.data.operation == "Un-Blocked"){
                showOpt.innerHTML = 'Block';
            } else {
                showOpt.innerHTML = 'Un-Block';
            }
        })
        .catch((err) => console.log(err.response));
}
