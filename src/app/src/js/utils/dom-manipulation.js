import './../../../typedefs';
import { createCommentButtonElements, createDeleteButtonElements, createElementForButtonWrapper, createFollowButtonElement, createFollowingButtonElement, createLikeButtonElements, createNewMessageHTML, createPinButtonElements, createPostElement, createRetweetButtonElements, createUserRowHTML } from './html-creators';
import { onKeyUpCommentTA, createFunctionToCloseModal } from './listeners';

/**
 * @param {post} post 
 */
function openModal(post) {
  const modal = document.getElementById('modal-container')
  modal.classList.remove('hidden')

  fillModalWithPostValues(modal, post)
  adjustHeightOfSeparator(modal);

  const taReply = modal.querySelector("div.reply-aria textarea")
  taReply.addEventListener('keyup', onKeyUpCommentTA)

  const closebutton = modal.querySelector('.close-modal-button')
  closebutton.addEventListener('click', createFunctionToCloseModal(modal, taReply))
}
function emptyImagePreviewContainer() {
  const imagePreviewContainer = document.querySelector("#image-preview");

  /** @type {HTMLElement} */
  const imageTag = document.createElement("img")
  imageTag.setAttribute('src', '');
  imageTag.setAttribute('class', 'block max-w-full w-full');

  imagePreviewContainer.innerHTML = "";
  imagePreviewContainer.appendChild(imageTag)
}

function emptyFileContainer() {
  const fileContainer = document.querySelector('#file-preview-wrapper')
  const input = document.createElement('input');
  input.type = 'file'
  input.name = 'profile-photo'
  input.id = 'photo';
  input.dataset.type = "profile"
  fileContainer.innerHTML = '';
  fileContainer.appendChild(input);
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
 * @param { HTMLElement } btn 
 * @param { String } hoverClass 
 */
function enableButton(btn, hoverClass) {
  btn.classList.add(hoverClass);
  btn.classList.add('cursor-pointer');
  btn.classList.remove('cursor-auto');
  btn.classList.remove('bg-opacity-50');
  btn.removeAttribute('disabled')
}
/**
 * Disables button for creating new post
 * @param { HTMLElement } btn 
 * @param { String } hoverClass 
 */
function disableButton(btn, hoverClass) {
  btn.classList.add('bg-opacity-50');
  btn.classList.add('cursor-auto');
  btn.classList.remove(hoverClass);
  btn.classList.remove('cursor-pointer');
  btn.setAttribute('disabled', true)
}
/**
 * Adds newly created post to the targetElement
 * @param { HTMLElement } targetElement 
 * @param {post} post
 * @param { string } method 
 */
function addNewPost(targetElement, post, createdAt, method = 'prepend') {
  const postElement = createPostElement(post._id, post.content, post.postedBy, createdAt);
  targetElement[method](postElement);

  createElementForButtonWrapper(postElement, '.button-comment-wrapper', createCommentButtonElements)
  createElementForButtonWrapper(postElement, '.button-retweet-wrapper', createRetweetButtonElements)
  createElementForButtonWrapper(postElement, '.button-like-wrapper', createLikeButtonElements)
  createElementForButtonWrapper(postElement, '.delete-post-button-wrapper', createDeleteButtonElements)
}

/**
 * Adds newly created post to the targetElement
 * @param { HTMLElement } targetElement 
 * @param {post} post
 * @param { string } method 
 */
function addNewPostWithPredefinedButtons(targetElement, post, method = 'prepend') {
  const postElement = createPostElement(post._id, post.content, post.postedBy, post.fromNow);
  targetElement[method](postElement);

  createElementForButtonWrapper(postElement, '.button-comment-wrapper', () => createCommentButtonElements(post))
  createElementForButtonWrapper(postElement, '.button-retweet-wrapper', () => createRetweetButtonElements(post))
  createElementForButtonWrapper(postElement, '.button-like-wrapper', () => createLikeButtonElements(post))
  if (post.hasDelete) {
    createElementForButtonWrapper(postElement, '.delete-post-button-wrapper', createDeleteButtonElements)
  }
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
 * @param {HTMLElement} label 
 * @param {HTMLElement} spinner 
 */
function hideSpinner(label, spinner) {
  enableButton(spinner.parentElement);
  label.classList.remove('hidden')
  spinner.classList.add('hidden')
}

/**
 * Shows spinner inside of button for posting new post
 * @param {HTMLElement} label 
 * @param {HTMLElement} spinner 
 */
function showSpinner(label, spinner) {
  label.classList.add('hidden')
  spinner.classList.remove('hidden')
  disableButton(spinner.parentElement);
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
 * @param {HTMLElement} postBtn 
 * @param {Function} isAvailableFN 
 * @param {string} hoverClassToRemoveOrAdd 
 */
function toggleButtonAvailability(postBtn, isAvailableFN, hoverClassToRemoveOrAdd = 'hover:bg-comment-button-blue') {
  if (isAvailableFN()) {
    disableButton(postBtn, hoverClassToRemoveOrAdd)
  } else {
    enableButton(postBtn, hoverClassToRemoveOrAdd)
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
/**
 * @param {Event} e 
 * @returns {string}
 */
function getProfileIdFromFollowButton(e) {
  const profileId = e.target.dataset.profileId

  if (!profileId) {
    alert("Profile id is not defined");
    return
  }
  return profileId
}
/**
 * 
 * @param {Event} e 
 * @param {HTMLElement} label 
 * @param {HTMLElement} span 
 */
function toggleFollowButtons(e, label, span) {
  if (e.target.classList.contains('unfollow-button')) {
    e.target.classList.remove('unfollow-button')
    e.target.classList.add('follow-button')
    label.innerText = "Follow";
    const messageButton = document.querySelector('button.message-user-link')
    messageButton && messageButton.classList.add('hidden');
    if (span) span.innerText = Number(span.innerText) - 1;

  } else {
    e.target.classList.remove('follow-button')
    e.target.classList.add('unfollow-button')
    const messageButton = document.querySelector('button.message-user-link')
    messageButton && messageButton.classList.remove('hidden');
    label.innerText = "Following"
    if (span) span.innerText = Number(span.innerText) + 1;
  }
}

function clearPostPinnedArea() {
  document.querySelector("#profile-posts div.pinned-post-wrapper").innerHTML = '';
}
/**
 * 
 * @param {user} user 
 * @param {boolean} displayFollowButton 
 * @returns { HTMLElement }
 */
function createSearchResultRowElement(user, displayFollowButton = true) {
  const div = document.createElement('div');
  const row = createUserRowHTML(user)
  div.innerHTML = row
  const wrap = div.querySelector('div.follow-button-wrap')

  if (user.isFollowed) {
    displayFollowButton && wrap.appendChild(createFollowingButtonElement(user))
  } else {
    displayFollowButton && wrap.appendChild(createFollowButtonElement(user))
  }

  return div;
}
/**
 * @param {Array.<user>} selectedUsers 
 */
function displaySelectedUsers(selectedUsers) {
  const searchInputWrapper = document.querySelector("div#inbox div.user-list-wrapper span.users")
  if (selectedUsers.length > 0) {
    searchInputWrapper.classList.add('pr-2')
  } else {
    searchInputWrapper.classList.remove('pr-2')
  }
  searchInputWrapper.querySelectorAll('span.user-username').forEach(el => el.remove())

  selectedUsers.forEach(user => {
    const span = document.createElement('span')
    span.className = 'user-username px-2 py-1 mr-1 mb-1 inline-block text-brand-blue ';
    span.innerHTML = `${user.username}`
    searchInputWrapper.append(span)
  })
}
/**
 * Creates HTML div for every user in inbox search
 * @param {user} user 
 * @param {Array.<user>} selectedUsers 
 * @param {HTMLElement} searchInput 
 * @param {HTMLElement} contentWrapper 
 */
function createRowAndAddListener(user, selectedUsers, searchInput, contentWrapper) {
  const div = createSearchResultRowElement(user, false)
  const aTag = document.createElement("a");

  aTag.addEventListener('click', e => {
    e.stopPropagation();
    e.preventDefault();

    emptyTextboxAndContainer(searchInput, contentWrapper)
    selectedUsers.push(user);
    toggleButtonAvailability(createChatButton, () => selectedUsers.length == 0);
    displaySelectedUsers(selectedUsers)
  });
  aTag.appendChild(div)
  contentWrapper.append(aTag)
}
/**
 * @param {HTMLElement} searchInput 
 * @param {HTMLElement} contentWrapper 
 */
function emptyTextboxAndContainer(searchInput, contentWrapper) {
  searchInput.value = '';
  searchInput.focus();
  contentWrapper.innerHTML = '';
}
/**
 * 
 * @param {message} message 
 * @param {string} type 
 */
function addNewMessage(message, type) {
  const messagesContainer = document.querySelector('#inbox > div.chat-messages-wrapper div.chat-messages-container');
  const content = message.content;

  const html = createNewMessageHTML(content, type == 'sent');
  messagesContainer.innerHTML += html
}
/**
 * 
 * @param {HTMLElement} messagesContainer 
 */
function scrollMessagesToBottom(messagesContainer) {
  messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' });
}

function showTypingDots() {
  console.log(document.querySelector('div.chat-typing-container'))
  document.querySelector('div.chat-typing-container').classList.remove('hidden')
}

function hideTypingDots() {
  document.querySelector('div.chat-typing-container').classList.add('hidden')
}

export {
  enableButton,
  disableButton,
  addNewPost,
  showTypingDots,
  hideTypingDots,
  createSearchResultRowElement,
  addNewPostWithPredefinedButtons,
  hideSpinner,
  showSpinner,
  getProfileIdFromFollowButton,
  clearPostPinnedArea,
  findPostWrapperElement,
  animateButtonAfterClickOnLike,
  animateButtonAfterClickOnRetweet,
  toggleButtonAvailability,
  emptyImagePreviewContainer,
  emptyFileContainer,
  toggleScrollForTextarea,
  toggleFollowButtons,
  setSeparatorHeightForAllReplies,
  getPostIdForWrapper,
  openModal,
  displaySelectedUsers,
  createRowAndAddListener,
  addNewMessage,
  scrollMessagesToBottom
}
