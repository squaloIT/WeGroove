import './../../../typedefs';
import { onClickLikePost, onClickRetweetPost, onClickCommentPost, onKeyUpCommentTA, createFunctionToCloseModal, onClickDeletePost } from './listeners';

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
 * Adds newly created post to the div#posts
 * @param { String } postId 
 * @param { String } content 
 * @param { user } user 
 * @param { Timestamp } createdAt 
 */
function addNewPost(postId, content, user, createdAt) {
  console.log("🚀 ~ file: dom-manipulation.js ~ line 72 ~ addNewPost ~ postId", postId)
  const postsDiv = document.querySelector('#posts');
  const postElement = document.createElement('div')

  postElement.className = `post-wrapper w-full border-b border-super-light-gray-border flex flex-row space-x-5 py-3 px-8 justify-between animate__animated`;
  postElement.dataset.pid = postId;
  postElement.innerHTML = createPostHTML(content, user, createdAt)
  postsDiv.prepend(postElement);

  createElementForButtonWrapper(postElement, '.button-comment-wrapper', createCommentButtonElements)
  createElementForButtonWrapper(postElement, '.button-retweet-wrapper', createRetweetButtonElements)
  createElementForButtonWrapper(postElement, '.button-like-wrapper', createLikeButtonElements)
  createElementForButtonWrapper(postElement, '.delete-post-button-wrapper', createDeleteButtonElements)
}
/**
 * @param { HTMLElement } postElement 
 * @param { String } wrapperClass 
 * @param { Function } fnToCreateElements 
 */
function createElementForButtonWrapper(postElement, wrapperClass, fnToCreateElements) {
  const wrapper = postElement.querySelector(wrapperClass)
  const { span, button } = fnToCreateElements()
  wrapper.appendChild(button)
  if (span) {
    wrapper.appendChild(span)
  }
}

/** @returns { buttonWrapperElements } */
function createCommentButtonElements() {
  const button = document.createElement('button')
  button.className = 'comment-button -ml-2 hover:bg-comment-button-blue-background hover:text-comment-button-blue p-2 rounded-full'
  button.addEventListener('click', onClickCommentPost);
  button.innerHTML = getCommentButtonContent()

  const span = document.createElement('span')
  span.className = 'comment-num  flex items-center font-normal text-gray-700 ml-1';
  span.innerHTML = '&nbsp;&nbsp;';

  return { button, span }
}

/** @returns { buttonWrapperElements } */
function createRetweetButtonElements() {
  const button = document.createElement('button')
  button.className = 'retweet-post hover:bg-retweet-button-green-background hover:text-retweet-button-green p-2 rounded-full'
  button.addEventListener('click', onClickRetweetPost);
  button.innerHTML = getRetweetButtonContent()

  const span = document.createElement('span')
  span.className = 'retweet-num flex items-center font-normal text-gray-700 ml-1';
  span.innerHTML = '&nbsp;&nbsp;';

  return { button, span }
}

/** @returns { buttonWrapperElements } */
function createLikeButtonElements() {
  const button = document.createElement('button')
  button.className = 'post-like hover:bg-like-button-red-background hover:text-like-button-red p-2 rounded-full'
  button.addEventListener('click', onClickLikePost);
  button.innerHTML = getLikeButtonContent()

  const span = document.createElement('span')
  span.className = 'likes-num flex items-center font-normal text-gray-700';
  span.innerHTML = '&nbsp;&nbsp;';

  return { span, button }
}

/** @returns { buttonWrapperElements } */
function createDeleteButtonElements() {
  const button = document.createElement('button')
  button.className = 'cursor-pointer delete-post-button focus:outline-none p-2 rounded-full'
  button.addEventListener('click', onClickDeletePost);
  button.innerHTML = getDeleteButtonContent()

  return { span: null, button }
}

/** @returns String */
const getDeleteButtonContent = () => `<svg viewBox="0 0 24 24" aria-hidden="true" class="fill-current pointer-events-none text-mid-gray-for-text w-5 h-5">
    <g><path class='' d="M13.414 12l5.793-5.793c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0L12 10.586 6.207 4.793c-.39-.39-1.023-.39-1.414 0s-.39 1.023 0 1.414L10.586 12l-5.793 5.793c-.39.39-.39 1.023 0 1.414.195.195.45.293.707.293s.512-.098.707-.293L12 13.414l5.793 5.793c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L13.414 12z"></path></g>
</svg>`;

/** @returns String */
const getCommentButtonContent = () => `<svg viewBox="0 0 24 24" aria-hidden="true" class="inline-block fill-current h-5 w-5 align-text-bottom"><g><path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path></g></svg>`;

/** @returns String */
const getRetweetButtonContent = () => `<svg viewBox="0 0 24 24" aria-hidden="true" class="retweet-icon animate__animated pointer-events-none inline-block fill-current h-5 w-5 align-text-bottom">
<g>
  <path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"></path>
</g>
</svg>`;

/** @returns String */
const getLikeButtonContent = () => `<svg viewBox="0 0 24 24" aria-hidden="true" class="animate__animated heart-icon pointer-events-none inline-block fill-current h-5 w-5 align-text-bottom ">
<g>
 
    <path class="hidden" d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"></path>
  
    <path class="inline-block" d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path>
  
</g>
</svg>`;

/**
 * Creates html string for post.  
 * @param { String } content 
 * @param { user } user  
 * @param { Timestamp } createdAt 
 * @returns String
 */
function createPostHTML(content, user, createdAt) {
  const {
    _id,
    profilePic,
    username,
    firstName,
    lastName
  } = user;

  return `<div class="post__image-container w-14 h-14">
    <a href="/profile/${user.username}" class='cursor-pointer'>
      <img
        class="rounded-full bg-white"
        src="${profilePic}"
        alt="${username} profile pic"
      />
    </a>
  </div>

  <div class='post-content-container flex flex-col w-full'>
    <div class='post-content__info flex flex-row items-center w-full'>
      <div class='w-8/12 flex flex-row items-center'>
        <div class="post-content-info__username-container cursor-pointer">
          <p class="name font-bold">
            <a href="/profile/${user.username}">${firstName} ${lastName} -
            </a>
          </p>
        </div>

        <div class="post-content-info__email-container ml-1 cursor-pointer">
          <a class="username text-brand-blue font-medium" href="/profile/${user.username}">@${username} </a>
        </div>

        <div class="post-content-info__time-container ml-1">
          <p class="time font-normal">- ${createdAt}</p>
        </div>
      </div>

      <div class='w-4/12'>
        <div class="delete-post-button-wrapper flex items-start justify-end pr-2">

        </div>
      </div>
    </div>

    <div class="post-content__text w-full mt-1 cursor-pointer">
      <p>${content}</p>
    </div>

    <div class='w-full flex flex-row justify-end mt-2'>
      <div class="w-full post-content__buttons justify-between flex flex-row">
        <div class="flex justify-start button-comment-wrapper">

        </div>

        <div class="flex justify-end button-retweet-wrapper">

        </div>

        <div class="flex justify-end button-like-wrapper">

        </div>
      </div>
    </div>
  </div>`
}

/**
 * Recursively finds data-pid prop
 * @param { HTMLElement } element 
 * @returns { boolean | HTMLElement }
 */
function findPostWrapperElement(element) {
  if (['body', 'head', 'html'].includes(element.tagName.toLowerCase())) {
    return false;
  }

  if (element.tagName.toLowerCase() == 'div' && element.classList.contains('post-wrapper')) {
    const pid = element.dataset.pid;

    if (!pid) {
      return false;
    }

    return element;
  }

  return findPostWrapperElement(element.parentElement);
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
  openModal
}
