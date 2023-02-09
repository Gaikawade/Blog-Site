function like(postId){
  const likeCount = document.getElementById(`likes-count-${postId}`);
  const likeButton = document.getElementById(`like-button-${postId}`);

  fetch(`/like_post/${postId}`, {method: 'POST'})
  .then((res) => res.json())
  .then((data) =>{
    console.log(data);
    likeCount.innerHTML = data[`likes`];
    if(data[`likes`] == true){
      likeButton.className = 'fas fa-thumbs-up';
    } else {
      likeButton.className = 'far fa-thumbs-up';
    }
  })
  .catch(e => alert('Please try after some time.'));
}