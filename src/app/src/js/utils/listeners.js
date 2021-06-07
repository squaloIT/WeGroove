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
  const postWrapper = findPostWrapperElement(likeButton, 'post-wrapper');

  if (!postWrapper) {
    alert("Couldnt find post id")
    return;
  }

  const pid = getPostIdForWrapper(postWrapper)
  const otherPostLikeButtonsOnThePageWithSamePostID = document.querySelectorAll(`div.post-wrapper[data-pid="${pid}"] button.post-like, div.post-wrapper[data-retweet-id="${pid}"] button.post-like`)

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
  /** @type { HTMLElement } */
  const postWrapper = findPostWrapperElement(button, 'post-wrapper');

  if (!postWrapper) {
    alert("Couldnt find post id")
    return;
  }

  let pid = getPostIdForWrapper(postWrapper);

  retweetPost(pid)
    .then(res => res.json())
    .then(res => {
      if (postWrapper.dataset.retweetId) {
        postWrapper.classList.add('animate__bounceOutRight')
        setTimeout(() => {
          postWrapper.remove()
          const retweetWrapper = document.querySelector(`div.post-wrapper[data-pid='${postWrapper.dataset.retweetId}'] div.button-retweet-wrapper`);

          removeUIRetweetedIndication(retweetWrapper)
        }, 420)
      } else {
        animateButtonAfterClickOnRetweet(button, res.data.post.retweetUsers.length)
        const postsWhichRetweetedThis = document.querySelectorAll(`div.post-wrapper[data-retweet-id='${pid}'] `)

        Array.from(postsWhichRetweetedThis).forEach(
          post => {
            post.classList.add('animate__bounceOutRight')
            setTimeout(() => {
              post.remove()
            }, 420)
          }
        )
      }
    })
    .catch(err => console.error(err));
}
/**
 * @param {Event} e 
 */
function onClickCommentPost(e) {
  e.stopPropagation()
  const button = e.target;
  const postWrapper = findPostWrapperElement(button, 'post-wrapper');

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
  const postWrapper = findPostWrapperElement(e.target, 'post-wrapper');

  if (!postWrapper) {
    alert("Couldnt find post id!")
    return;
  }

  const pid = getPostIdForWrapper(postWrapper);

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
  const postWrapper = findPostWrapperElement(e.target, 'post-wrapper');

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
        const postsToBeRemovedFromDOM = document.querySelectorAll(`div.post-wrapper[data-pid="${pid}"], div.post-wrapper[data-retweet-id="${pid}"]`)

        Array.from(postsToBeRemovedFromDOM).forEach(el => {
          el.classList.add('animate__bounceOutRight')
        })

        setTimeout(() => {
          Array.from(postsToBeRemovedFromDOM).forEach(el => {
            el.remove()

            if (data.retweetedPost) {
              const retweetWrapper = document.querySelector(`div.post-wrapper[data-pid='${data.retweetedPost}'] div.button-retweet-wrapper`);
              removeUIRetweetedIndication(retweetWrapper)
            }
          })
        }, 420)
      }

      if (data.status === 200) {
        alert("there was no post to be deleted")
      }
    })
}
/** 
 * @param {HTMLElement} retweetWrapper 
 */
function removeUIRetweetedIndication(retweetWrapper) {
  const retweetSVG = retweetWrapper.querySelector('svg.retweet-icon');

  retweetSVG.classList.remove('text-retweet-button-green');
  retweetSVG.classList.remove('filled');

  const span = retweetWrapper.querySelector('span.retweet-num')
  const numOfRetweets = span.innerText;

  span.innerHTML = (numOfRetweets - 1) == 0 ? '&nbsp;&nbsp;' : numOfRetweets - 1;
  span.classList.remove('text-retweet-button-green')
}
/**
 * @param {HTMLElement} postWrapper 
 * @returns { string }
 */
function getPostIdForWrapper(postWrapper) {
  return postWrapper.dataset.retweetId || postWrapper.dataset.pid
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