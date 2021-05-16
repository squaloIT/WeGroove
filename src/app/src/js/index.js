import { createPost, likePost } from './utils/api';
import { disableButton, enableButton, addNewPost, showSpinner, hideSpinner, findPostId, changeLikeIcon } from './utils/dom-manipulation';

document.querySelector('textarea#post')
  .addEventListener('keyup', checkInsertPostTextArea)

document.querySelector('button#submitPostButton')
  .addEventListener('click', () => {
    const postContentTextbox = document.querySelector('textarea#post')
    const postContentValue = postContentTextbox.value.trim();

    const postButtonLabel = document.querySelector('.post-button__label')
    const postButtonSpinner = document.querySelector('.post-button__spinner')
    showSpinner(postButtonLabel, postButtonSpinner)

    if (postContentValue.length > 0) {
      createPost(postContentValue)
        .then(res => res.json())
        .then(res => {
          postContentTextbox.value = '';
          addNewPost(res.createdPost._id, res.createdPost.content, res.createdPost.postedBy, "moments ago");
          hideSpinner(postButtonLabel, postButtonSpinner)
        })
        .catch(err => {
          console.error(err)
          alert("Ooops, there was an error trying to save your post...")
        })
    } else {
      hideSpinner(postButtonLabel, postButtonSpinner)
    }
  })

Array.from(document.querySelectorAll('.post-like')).forEach(el => {
  el.addEventListener('click', onClickLikePost)
})

function onClickLikePost(e) {
  const likeButton = e.target;
  const pid = findPostId(likeButton);

  likePost(pid)
    .then(res => res.json())
    .then(res => {
      const icon = likeButton.querySelector('i.fa-heart');
      changeLikeIcon(icon)

      const span = likeButton.parentElement.querySelector('span.likes-num')
      span.innerHTML = res.post.likes.length || '&nbsp;&nbsp;';
    })
    .catch(err => console.error(err));
}

function checkInsertPostTextArea(e) {
  const postValue = e.target.value;
  const postBtn = document.querySelector('button#submitPostButton')

  if (postValue.trim().length == 0) {
    disableButton(postBtn)
  } else {
    enableButton(postBtn)
  }

  postBtn.disabled = postValue.trim().length == 0
}