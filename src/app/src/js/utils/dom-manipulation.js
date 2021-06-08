import './../../../typedefs';
import { createCommentButtonElements, createDeleteButtonElements, createElementForButtonWrapper, createLikeButtonElements, createPostElement, createRetweetButtonElements } from './html-creators';
import { onKeyUpCommentTA, createFunctionToCloseModal } from './listeners';

/**
 * @param {post} post 
 */
function openModal(post) {
  const modal = document.getElementById('comment-modal')
  modal.classList.remove('hidden')

  fillModalWithPostValues(modal, post)
  adjustHeightOfSeparator(modal);

  const taReply = modal.querySelector("div.reply-aria textarea")
  taReply.addEventListener('keyup', onKeyUpCommentTA)

  const closebutton = modal.querySelector('.close-modal-button')
  closebutton.addEventListener('click', createFunctionToCloseModal(modal, taReply))
}
/**
 * @param {HTMLElement} modal 
 */
function adjustHeightOfSeparator(modal) {
  const rightColumnHeaderHeight = modal.querySelector('div.modal-content__right-column div.right-column__header').offsetHeight
  const rightColumnPostContentHeight = modal.querySelector('div.modal-content__right-column div.post-content').offsetHeight
  const rightColumnReplyAreaHeight = modal.querySelector('div.modal-content__right-column div.reply-aria').offsetHeight
  const val = rightColumnHeaderHeight + rightColumnPostContentHeight + rightColumnReplyAreaHeight;

  modal.querySelector('div.left-column__line-separator').style.height = (val / 3)
}
/**
 * @param {post} post 
 */
function fillModalWithPostValues(modal, post) {
  modal.querySelector('div.comment-modal__content div.post-content > p').innerHTML = post.content;
  modal.querySelector('div.comment-modal__content span.postedBy-name').innerHTML = post.postedBy.firstName + " " + post.postedBy.lastName;
  modal.querySelector('div.comment-modal__content span.postedBy-username').innerHTML = `@${post.postedBy.username}`;
  modal.querySelector('div.comment-modal__content span.postedBy-month-and-date').innerHTML = post.fromNow;
  modal.querySelector('div.comment-modal__content a.postedBy-username-link').innerHTML = `@${post.postedBy.username}`;
  modal.querySelector('div.reply-button-wrapper button.reply-comment-button').dataset.pid = post._id;
}
/**
 * Enables button for creating new post
 * @param { HTMLElement } postBtn 
 * @param { String } hoverClass 
 */
function enableButton(postBtn, hoverClass) {
  postBtn.classList.add(hoverClass);
  postBtn.classList.add('cursor-pointer');
  postBtn.classList.remove('cursor-auto');
  postBtn.classList.remove('bg-opacity-50');
}
/**
 * Disables button for creating new post
 * @param { HTMLElement } postBtn 
 * @param { String } hoverClass 
 */
function disableButton(postBtn, hoverClass) {
  postBtn.classList.add('bg-opacity-50');
  postBtn.classList.add('cursor-auto');
  postBtn.classList.remove(hoverClass);
  postBtn.classList.remove('cursor-pointer');
}
/**
 * Adds newly created post to the targetElement
 * @param { HTMLElement } targetElement 
 * @param { String } postId 
 * @param { String } content 
 * @param { user } user 
 * @param { Timestamp } createdAt 
 * @param { string } method 
 */
function addNewPost(targetElement, postId, content, user, createdAt, method = 'prepend') {
  const postElement = createPostElement(postId, content, user, createdAt);
  targetElement[method](postElement);

  createElementForButtonWrapper(postElement, '.button-comment-wrapper', createCommentButtonElements)
  createElementForButtonWrapper(postElement, '.button-retweet-wrapper', createRetweetButtonElements)
  createElementForButtonWrapper(postElement, '.button-like-wrapper', createLikeButtonElements)
  createElementForButtonWrapper(postElement, '.delete-post-button-wrapper', createDeleteButtonElements)
}

/**
 * Recursively finds data-pid prop
 * @param { HTMLElement } element 
 * @param { string } className 
 * @param { boolean } withoutPID 
 * @returns { boolean | HTMLElement }
 */
function findPostWrapperElement(element, className, withoutPID = false) {
  if (['body', 'head', 'html'].includes(element.tagName.toLowerCase())) {
    return false;
  }

  if (
    element.tagName.toLowerCase() == 'div' &&
    element.classList.contains(className) && (
      withoutPID ||
      getPostIdForWrapper(element)
    )) {
    if (withoutPID) {
      return element
    }

    const pid = element.dataset.pid;

    if (!pid) {
      return false;
    }

    return element;
  }

  return findPostWrapperElement(element.parentElement, className, withoutPID);
}
/**
 * @param {HTMLElement} postWrapper 
 * @returns { string }
 */
function getPostIdForWrapper(postWrapper) {
  return postWrapper.dataset.retweetId || postWrapper.dataset.pid
}
/**
 * Hides spinner inside of button for posting new post
 * @param {HTMLElement} postButtonLabel 
 * @param {HTMLElement} postButtonSpinner 
 */
function hideSpinner(postButtonLabel, postButtonSpinner) {
  disableButton(postButtonSpinner.parentElement);
  postButtonLabel.classList.remove('hidden')
  postButtonSpinner.classList.add('hidden')
}

/**
 * Shows spinner inside of button for posting new post
 * @param {HTMLElement} postButtonLabel 
 * @param {HTMLElement} postButtonSpinner 
 */
function showSpinner(postButtonLabel, postButtonSpinner) {
  postButtonLabel.classList.add('hidden')
  postButtonSpinner.classList.remove('hidden')
  disableButton(postButtonSpinner.parentElement);
}

const toggleClassesForPaths = paths => {
  Array.from(paths).forEach(path => {
    if (path.classList.contains('hidden')) {
      path.classList.remove('hidden')
      path.classList.add('inline-block')
    } else {
      path.classList.add('hidden')
      path.classList.remove('inline-block')
    }
  })
}
/**
 * 
 * @param {HTMLElement} likeButton 
 * @param {String} numOfRetweets 
 */
function animateButtonAfterClickOnLike(likeButton, numOfLikes) {
  const svgHeartIcon = likeButton.querySelector('svg.heart-icon');
  const span = likeButton.parentElement.querySelector('span.likes-num')
  const paths = svgHeartIcon.querySelectorAll('path');

  if (svgHeartIcon.classList.contains('filled')) {
    svgHeartIcon.classList.remove('filled')
    svgHeartIcon.classList.remove('text-like-button-red')
    if (span) {
      span.classList.remove('text-like-button-red')
    }
    toggleClassesForPaths(paths)
  } else {
    svgHeartIcon.classList.add('filled')
    svgHeartIcon.classList.add('animate__heartBeat')
    toggleClassesForPaths(paths)
    svgHeartIcon.classList.add('text-like-button-red')

    if (span) {
      span.classList.add('text-like-button-red')
    }

    setTimeout(() => {
      svgHeartIcon.classList.remove('animate__heartBeat')
    }, 2000)
  }

  span.innerHTML = numOfLikes || '&nbsp;&nbsp;';
}
/**
 * @param {HTMLElement} button 
 * @param {String} numOfRetweets 
 */
function animateButtonAfterClickOnRetweet(button, numOfRetweets) {
  const retweetIcon = button.querySelector('svg.retweet-icon');
  const span = button.parentElement.querySelector('span.retweet-num')

  if (retweetIcon.classList.contains('filled')) {
    retweetIcon.classList.remove('filled')
    retweetIcon.classList.remove('text-retweet-button-green')

    if (span) {
      span.classList.remove('text-retweet-button-green')
    }
  } else {
    retweetIcon.classList.add('filled')
    retweetIcon.classList.add('animate__swing')
    retweetIcon.classList.add('text-retweet-button-green')

    if (span) {
      span.classList.add('text-retweet-button-green')
    }
    setTimeout(() => {
      retweetIcon.classList.remove('animate__swing')
    }, 2000)
  }

  span.innerHTML = numOfRetweets || '&nbsp;&nbsp;';
}

/**
 * @param {String} postValue 
 * @param {HTMLElement} postBtn 
 */
function toggleButtonAvailability(postValue, postBtn) {
  if (postValue.trim().length == 0) {
    disableButton(postBtn, 'hover:bg-comment-button-blue')
  } else {
    enableButton(postBtn, 'hover:bg-comment-button-blue')
  }
}
/**
 * @param {Event} e 
 * @param {HTMLElement} postBtn 
 */
function toggleScrollForTextarea(e, postBtn) {
  e.target.style.height = 'auto';
  postBtn.disabled = e.target.value.trim().length == 0;

  if (e.target.scrollHeight > 150) {
    e.target.style.overflowY = 'scroll'
  } else {
    e.target.style.overflowY = 'hidden'
  }
  e.target.style.height = `${e.target.scrollHeight} `;
}

function setSeparatorHeightForAllReplies() {
  Array.from(
    document.querySelectorAll("div.posts-comment-wrapper")
  ).forEach(el => {
    const postWrapper = findPostWrapperElement(el, 'post-wrapper', true)
    const lineSeparator = postWrapper.querySelector('div.images-wrapper div.left-column__line-separator')
    const postOriginal = postWrapper.querySelector('div.original-post')
    lineSeparator.style.height = (postOriginal.offsetHeight / 2)
  })
}



export {
  enableButton,
  disableButton,
  addNewPost,
  hideSpinner,
  showSpinner,
  findPostWrapperElement,
  animateButtonAfterClickOnLike,
  animateButtonAfterClickOnRetweet,
  toggleButtonAvailability,
  toggleScrollForTextarea,
  setSeparatorHeightForAllReplies,
  getPostIdForWrapper,
  openModal
}
