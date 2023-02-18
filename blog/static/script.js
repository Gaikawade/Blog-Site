const currentURL = document.URL;

function like(postId) {
    const likeCount = document.getElementById(`likes-count-${postId}`);
    const likeButton = document.getElementById(`like-button-${postId}`);

    fetch(`/like_post/${postId}`, { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            likeCount.innerHTML = data[`likes`];
            if (data[`likes`] == true) {
                likeButton.className = "fas fa-thumbs-up";
            } else {
                likeButton.className = "far fa-thumbs-up";
            }
        })
        .catch((e) => alert("Please try after some time."));
}

if (currentURL.includes("post")) {
    const expandcommentInput = document.querySelector("#expand-comment-input");
    const commentField = document.querySelector("#give-comments");

    expandcommentInput.addEventListener("click", () => {
        if (commentField.style.display == "block") {
            commentField.style.display = "none";
        } else {
            commentField.style.display = "block";
        }
    });

    const comments = document.querySelector("#comments");
    const expandComments = document.querySelector("#expand-comments");

    expandComments.addEventListener("click", () => {
        if (comments.style.display == "block") {
            comments.style.display = "none";
        } else {
            comments.style.display = "block";
        }
    });
}

if (currentURL.includes("search")) {
    const posts = document.querySelector("#posts");
    const expandPosts = document.querySelector("#expand-posts");
    const users = document.querySelector("#users");
    const expandUsers = document.querySelector("#expand-users");

    expandPosts.addEventListener("click", () => {
        if (posts.style.display === "none") {
            posts.style.display = "block";
            users.style.display = "none";
        } else {
            posts.style.display = "none";
            users.style.display = "block";
        }
    });

    expandUsers.addEventListener("click", () => {
        if (users.style.display === "none") {
            users.style.display = "block";
            posts.style.display = "none";
        } else {
            users.style.display = "none";
            posts.style.display = "block";
        }
    });
}

function delComment(commentId){
    // const delButton = document.getElementById('delete-comment-button');

    fetch(`/delete_comment/${commentId}`, {method: 'DELETE'})
        .then((res)=> res.json())
        .then((data)=> console.log(data))
        .catch((err)=> console.error(err))

}