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


const comments = document.querySelector("#comments");
const expandComments = document.querySelector("#expand-comments");

expandComments.addEventListener("click", () =>{
    if (comments.style.display == 'block'){
        comments.style.display = 'none';
    } else {
        comments.style.display = 'block';
    }
})

const expandcommentInput = document.querySelector('#expand-comment-input');
const commentField = document.querySelector('#give-comments');
expandcommentInput.addEventListener('click', () =>{
    if(commentField.style.display == 'block'){
        commentField.style.display = 'none';
    } else {
        commentField.style.display = 'block';
    }
})