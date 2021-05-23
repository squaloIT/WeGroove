import { createPost } from './utils/api';
import { disableButton, enableButton, addNewPost, showSpinner, hideSpinner } from './utils/dom-manipulation';
import { onClickLikePost, onClickRetweetPost } from './utils/listeners';
import './../styles/tailwind.css';

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
          addNewPost(res.data.createdPost._id, res.data.createdPost.content, res.data.createdPost.postedBy, "moments ago");
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

Array.from(document.querySelectorAll('.retweet-post')).forEach(el => {
  el.addEventListener('click', onClickRetweetPost)
})



function checkInsertPostTextArea(e) {
  const postValue = e.target.value;
  const postBtn = document.querySelector('button#submitPostButton')

  if (postValue.trim().length == 0) {
    disableButton(postBtn)
  } else {
    enableButton(postBtn)
  }

  postBtn.disabled = postValue.trim().length == 0;
}