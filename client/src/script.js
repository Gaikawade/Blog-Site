import axios from "axios";

export function like(postId) {
    const likeCount = document.getElementById(`likes-count-${postId}`);
    const likeButton = document.getElementById(`like-button-${postId}`);

    axios
        .post(`/like_post/${postId}`)
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
    axios
        .delete(`/post/delete/${postId}`)
        .then((res) => {
            console.log(res.data);
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
    axios
        .put(`/admin/block_user/${id}`)
        .then((res) => {
            // console.log(res);
            if(res.data.operation == "Un-Blocked"){
                showOpt.innerHTML = 'Block';
            } else {
                showOpt.innerHTML = 'Un-Block';
            }
        })
        .catch((err) => console.log(err.response));
}
