import { createPost } from './utils/api';
import { disableButton, enableButton, addNewPost, showSpinner, hideSpinner } from './utils/dom-manipulation';
import { onClickLikePost, onClickRetweetPost, onClickCommentPost, onClickCommentButton, onPostWrapperClick, onClickDeletePost } from './utils/listeners';

export default function index() {
  const taPost = document.querySelector('textarea#post');

  if (taPost) {
    taPost.addEventListener('keyup', checkInsertPostTextArea);
  }

  const taReply = document.querySelector("div.reply-aria textarea")
  taReply.addEventListener('keyup', function (e) {
    if (e.target.scrollHeight > 110) {
      e.target.style.overflowY = 'scroll'
    } else {
      e.target.style.overflowY = 'hidden'
      e.target.style.height = `${e.target.scrollHeight}`;
    }

  });

  const submitPostButton = document.querySelector('button#submitPostButton')
  if (submitPostButton) {
    submitPostButton.addEventListener('click', () => {
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
            const targetElement = document.querySelector('#posts');
            addNewPost(targetElement, res.data.createdPost._id, res.data.createdPost.content, res.data.createdPost.postedBy, "moments ago");
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
  }

  document.querySelector('div.reply-button-wrapper button.reply-comment-button')
    .addEventListener('click', onClickCommentButton)

  Array.from(document.querySelectorAll('.comment-button')).forEach(el => {
    el.addEventListener('click', onClickCommentPost)
  })

  Array.from(document.querySelectorAll('.post-like')).forEach(el => {
    el.addEventListener('click', onClickLikePost)
  })

  Array.from(document.querySelectorAll('.retweet-post')).forEach(el => {
    el.addEventListener('click', onClickRetweetPost)
  })

  Array.from(document.querySelectorAll('.post-wrapper')).forEach(el => {
    el.addEventListener('click', onPostWrapperClick)
  })

  Array.from(
    document.querySelectorAll('div.post-wrapper div.delete-post-button-wrapper button.delete-post-button')
  ).forEach(el => {
    el.addEventListener('click', onClickDeletePost)
  })

  /**
  * @param {Event} e 
  */
  function checkInsertPostTextArea(e) {
    const postValue = e.target.value;
    const postBtn = document.querySelector('button#submitPostButton')

    if (postValue.trim().length == 0) {
      disableButton(postBtn, 'hover:bg-brand-purple-hover')
    } else {
      enableButton(postBtn, 'hover:bg-brand-purple-hover')
    }

    postBtn.disabled = postValue.trim().length == 0;
  }
}