import { likePost, retweetPost, getPostData, replyToPost, deletePostByID } from "./api";
import { animateButtonAfterClickOnLike, animateButtonAfterClickOnRetweet, showSpinner, hideSpinner, findPostWrapperElement, openModal, toggleButtonAvailability, toggleScrollForTextarea } from "./dom-manipulation";

/**
 * @param {Event} e 
 */
function onClickCommentButton(e) {
  e.stopPropagation();
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
/**
 * @param {Event} e 
 */
function onClickLikePost(e) {
  e.stopPropagation();
  const likeButton = e.target;
  const postWrapper = findPostWrapperElement(likeButton);

  if (!postWrapper) {
    alert("Couldnt find post id")
    return;
  }

  const pid = postWrapper.dataset.pid

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
/**
 * @param {Event} e 
 */
function onClickRetweetPost(e) {
  e.stopPropagation()
  const button = e.target;
  const postWrapper = findPostWrapperElement(button);

  if (!postWrapper) {
    alert("Couldnt find post id")
    return;
  }

  const pid = postWrapper.dataset.pid

  retweetPost(pid)
    .then(res => res.json())
    .then(res => {
      animateButtonAfterClickOnRetweet(button, res.data.post.retweetUsers.length)
    })
    .catch(err => console.error(err));
}
/**
 * @param {Event} e 
 */
function onClickCommentPost(e) {
  e.stopPropagation()
  const button = e.target;
  const postWrapper = findPostWrapperElement(button);

  if (!postWrapper) {
    alert("Couldnt find post id")
    return;
  }

  const pid = postWrapper.dataset.pid

  getPostData(pid)
    .then(res => res.json())
    .then(({ msg, status, data }) => {
      if (status == 200) {
        openModal(data)
      }
    })
}
/**
 * @param {Event} e 
 */
function onKeyUpCommentTA(e) {
  const postBtn = document.querySelector('div.reply-button-wrapper button.reply-comment-button')
  toggleButtonAvailability(e.target.value, postBtn)
  toggleScrollForTextarea(e, postBtn)
}
/**
 * @param {HTMLElement} modal 
 * @param {HTMLElement} taReply 
 * @returns { Function }
 */
const createFunctionToCloseModal = (modal, taReply) => () => {
  modal.classList.add('hidden')
  taReply.value = '';
  taReply.style.height = '50px';
  taReply.style.overflowY = 'hidden'
  modal.querySelector('div.left-column__line-separator').style.height = '0px'
}
/**
 * @param {Event} e 
 */
function onPostWrapperClick(e) {
  const postWrapper = findPostWrapperElement(e.target);

  if (!postWrapper) {
    alert("Couldnt find post id!")
    return;
  }

  const pid = postWrapper.dataset.pid;

  if (pid) {
    window.location.href = '/post/' + pid;
    return;
  }

  return alert("Couldn't find post id")
}

/**
 * @param {Event} e 
 */
function onClickDeletePost(e) {
  e.stopPropagation();
  const postWrapper = findPostWrapperElement(e.target);

  if (!postWrapper) {
    alert("Couldn't find post with that id")
    return;
  }

  const pid = postWrapper.dataset.pid;

  deletePostByID(pid)
    .then(res => res.json())
    .then(data => {
      if (data.status === 204) {
        postWrapper.classList.add('animate__bounceOutRight')
        const postsToBeRemovedFromDOM = document.querySelectorAll(`div.post-wrapper[data-pid="${pid}"]`)

        Array.from(postsToBeRemovedFromDOM).forEach(el => {
          el.classList.add('animate__bounceOutRight')
        })

        setTimeout(() => {
          Array.from(postsToBeRemovedFromDOM).forEach(el => {
            el.remove()
          })
        }, 420)
      }

      if (data.status === 200) {
        alert("there was no post to be deleted")
      }
    })
}

export {
  onClickLikePost,
  onClickCommentPost,
  onKeyUpCommentTA,
  createFunctionToCloseModal,
  onClickRetweetPost,
  onClickCommentButton,
  onClickDeletePost,
  onPostWrapperClick
}