import { likePost, retweetPost, getPostData, replyToPost } from "./api";
import { animateButtonAfterClickOnLike, animateButtonAfterClickOnRetweet, showSpinner, hideSpinner, findPostId, openModal, toggleButtonAvailability, toggleScrollForTextarea } from "./dom-manipulation";

function onClickCommentButton(e) {
  const pid = e.target.dataset.pid;
  const content = document.querySelector("div#comment-modal div.reply-aria textarea").value;

  const commentButtonLabel = document.querySelector('div#comment-modal div.reply-button-wrapper span.comment-button__label')
  const commentButtonSpinner = document.querySelector('div#comment-modal div.reply-button-wrapper .comment-button__spinner')
  showSpinner(commentButtonLabel, commentButtonSpinner)

  replyToPost(pid, content)
    .then(res => res.json())
    .then(({ status }) => {
      if (status == 201) {
        hideSpinner(commentButtonLabel, commentButtonSpinner);
        location.reload()
      }
    })
    .catch(err => {
      hideSpinner(commentButtonLabel, commentButtonSpinner)
      alert(err)
      console.error(err)
    });
}

function onClickLikePost(e) {
  const likeButton = e.target;
  const pid = findPostId(likeButton);

  const otherPostLikeButtonsOnThePageWithSamePostID = document.querySelectorAll(`div.post-wrapper[data-pid="${pid}"] button.post-like`)

  likePost(pid)
    .then(res => res.json())
    .then(res => {
      Array.from(otherPostLikeButtonsOnThePageWithSamePostID)
        .forEach(button => {
          animateButtonAfterClickOnLike(button, res.data.post.likes.length)
        })
    })
    .catch(err => console.error(err));
}

function onClickRetweetPost(e) {
  const button = e.target;
  const pid = findPostId(button);

  retweetPost(pid)
    .then(res => res.json())
    .then(res => {
      animateButtonAfterClickOnRetweet(button, res.data.post.retweetUsers.length)
    })
    .catch(err => console.error(err));
}

function onClickCommentPost(e) {
  const button = e.target;
  const pid = findPostId(button);
  //TODO - Do the rest

  getPostData(pid)
    .then(res => res.json())
    .then(({ msg, status, data }) => {
      if (status == 200) {
        openModal(data)
      }
    })
}

function onKeyUpCommentTA(e) {
  const postBtn = document.querySelector('div.reply-button-wrapper button.reply-comment-button')
  toggleButtonAvailability(e.target.value, postBtn)
  toggleScrollForTextarea(e, postBtn)
}

const createFunctionToCloseModal = (modal, taReply) => (e) => {
  modal.classList.add('hidden')
  taReply.value = '';
  taReply.style.height = '50px';
  taReply.style.overflowY = 'hidden'
  modal.querySelector('div.left-column__line-separator').style.height = '0px'
}

export {
  onClickLikePost,
  onClickCommentPost,
  onKeyUpCommentTA,
  createFunctionToCloseModal,
  onClickRetweetPost,
  onClickCommentButton
}