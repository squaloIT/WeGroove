import { onClickLikePost, onClickRetweetPost, onClickCommentPost, onClickDeletePost, onClickTogglePinned, onFollowOrUnfollowClick } from './listeners';

/** @returns String */
const getDeleteButtonContent = () => `<svg viewBox="0 0 24 24" aria-hidden="true" class="fill-current pointer-events-none text-mid-gray-for-text w-5 h-5">
    <g><path class='' d="M13.414 12l5.793-5.793c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0L12 10.586 6.207 4.793c-.39-.39-1.023-.39-1.414 0s-.39 1.023 0 1.414L10.586 12l-5.793 5.793c-.39.39-.39 1.023 0 1.414.195.195.45.293.707.293s.512-.098.707-.293L12 13.414l5.793 5.793c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L13.414 12z"></path></g>
</svg>`;

/** @returns String */
const getFollowButtonContent = text => `<span class='follow-button__label pointer-events-none'>${text}</span>
<i class="follow-button__spinner hidden fas fa-spinner fa-pulse"></i>`;

/** @returns String */
const getCommentButtonContent = () => `<svg viewBox="0 0 24 24" aria-hidden="true" class="inline-block fill-current h-5 w-5 align-text-bottom"><g><path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path></g></svg>`;

/** @returns String */
const getRetweetButtonContent = (post = null) => `<svg viewBox="0 0 24 24" aria-hidden="true" class="retweet-icon animate__animated pointer-events-none inline-block fill-current h-5 w-5 align-text-bottom ${post && post.isRetweeted ? 'text-retweet-button-green filled' : ''}">
<g>
  <path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"></path>
</g>
</svg>`;

/** @returns String */
const getLikeButtonContent = (post = null) => `<svg viewBox="0 0 24 24" aria-hidden="true" class="animate__animated heart-icon pointer-events-none inline-block fill-current h-5 w-5 align-text-bottom ${post?.isLiked ? 'text-like-button-red filled' : ''}">
<g>
 
    <path class="${post?.isLiked ? 'inline-block' : 'hidden'}" d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"></path>
  
    <path class="${post?.isLiked ? 'hidden' : 'inline-block'}" d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path>
  
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
 * @param { String } postId 
 * @param { String } content 
 * @param { user } user 
 * @param { Timestamp } createdAt 
 * @returns { HTMLElement }
 */
function createPostElement(postId, content, user, createdAt) {
  const postElement = document.createElement('div')

  postElement.className = `post-wrapper w-full border-b border-super-light-gray-border flex flex-row space-x-5 py-3 px-8 justify-between animate__animated`;
  postElement.dataset.pid = postId;
  postElement.innerHTML = createPostHTML(content, user, createdAt)
  return postElement;
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
function createCommentButtonElements(post = null) {
  const button = document.createElement('button')
  button.className = 'comment-button -ml-2 hover:bg-comment-button-blue-background hover:text-comment-button-blue p-2 rounded-full'
  button.addEventListener('click', onClickCommentPost);
  button.innerHTML = getCommentButtonContent()

  const span = document.createElement('span')
  span.className = 'comment-num  flex items-center font-normal text-gray-700 ml-1';
  span.innerHTML = post && post.numOfComments > 0 ? post.numOfComments : '&nbsp;&nbsp;';

  return { button, span }
}

/** @returns { buttonWrapperElements } */
function createRetweetButtonElements(post = null) {
  const button = document.createElement('button')
  button.className = 'retweet-post hover:bg-retweet-button-green-background hover:text-retweet-button-green p-2 rounded-full'
  button.addEventListener('click', onClickRetweetPost);
  button.innerHTML = getRetweetButtonContent(post)

  const span = document.createElement('span')
  span.className = 'retweet-num flex items-center font-normal ml-1';

  if (post && post.isRetweeted) {
    span.classList.add('text-retweet-button-green')
  } else {
    span.classList.add('text-gray-700')
  }
  span.innerHTML = post && post.isRetweeted ? post.retweetUsers.length : '&nbsp;&nbsp;';

  return { button, span }
}

/** @returns { buttonWrapperElements } */
function createLikeButtonElements(post = null) {
  const button = document.createElement('button')
  button.className = 'post-like hover:bg-like-button-red-background hover:text-like-button-red p-2 rounded-full'
  button.addEventListener('click', onClickLikePost);
  button.innerHTML = getLikeButtonContent(post)

  const span = document.createElement('span')
  span.className = 'likes-num flex items-center font-normal';
  if (post && post.isLiked) {
    span.classList.add('text-like-button-red')
    span.classList.add('filled')
  } else {
    span.classList.add('text-gray-700')
  }
  span.innerHTML = post && post.isLiked ? post.likes.length : '&nbsp;&nbsp;';

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

/** @returns { HTMLElement } */
function createFollowButtonElement(user) {
  const button = document.createElement('button')
  button.dataset.profileId = user._id;

  button.className = 'following-unfollowing follow-button cursor-pointer text-base rounded-xl outline-none px-3 py-2 font-semibold ring-0 focus:outline-white focus:shadow-none focus:ring-0'
  button.addEventListener('click', e => onFollowOrUnfollowClick(e, 'follow'));
  button.innerHTML = getFollowButtonContent("Follow")

  return button
}

/** @returns { HTMLElement } */
function createFollowingButtonElement(user) {
  const button = document.createElement('button')
  button.dataset.profileId = user._id;

  button.className = 'following-unfollowing unfollow-button cursor-pointer text-base font-semibold rounded-xl outline-none px-3 py-2 focus:outline-white focus:shadow-none focus:ring-0'
  button.addEventListener('click', e => onFollowOrUnfollowClick(e, 'unfollow'));
  button.innerHTML = getFollowButtonContent("Following")

  return button
}

function createUserRowHTML(user) {
  return `<div class='w-full px-6 flex py-4 border-b border-super-light-gray-border'>
  <div class='w-4/5 flex'>
    <div class="image-container w-14 h-14">
      <a href="/profile/${user.username}">
        <img class='w-14 h-14 rounded-full bg-white' src="${user.profilePic}" alt="${user.username}" />
      </a>
    </div>

    <div class='info ml-6 font-roboto w-[85%]'>
      <a href="/profile/${user.username}">
        <p class='full-name font-bold'>${user.firstName} ${user.lastName}</p>
        <p class='username text-brand-dark-gray'>@${user.username}</p>
        <p class='description'>${user.description}</p>
      </a>
    </div>
  </div>
  
  <div class='w-1/5 flex flex-col justify-start follow-button-wrap'>

   
  </div>
</div>`
}

export {
  createPostHTML,
  getCommentButtonContent,
  getDeleteButtonContent,
  getLikeButtonContent,
  createFollowingButtonElement,
  createFollowButtonElement,
  createUserRowHTML,
  getRetweetButtonContent,
  createDeleteButtonElements,
  createCommentButtonElements,
  createElementForButtonWrapper,
  createLikeButtonElements,
  createPostElement,
  createRetweetButtonElements
}