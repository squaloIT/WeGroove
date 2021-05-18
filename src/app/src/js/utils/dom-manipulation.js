/**
 * Enables button for creating new post
 * @param { HTMLElement } postBtn 
 */
function enableButton(postBtn) {
  postBtn.classList.add('hover:bg-brand-purple-hover');
  postBtn.classList.add('cursor-pointer');
  postBtn.classList.remove('cursor-auto');
  postBtn.classList.remove('bg-opacity-50');
}
/**
 * Disables button for creating new post
 * @param { HTMLElement } postBtn 
 */
function disableButton(postBtn) {
  postBtn.classList.add('bg-opacity-50');
  postBtn.classList.add('cursor-auto');
  postBtn.classList.remove('hover:bg-brand-purple-hover');
  postBtn.classList.remove('cursor-pointer');
}
/**
 * Adds newly created post to the div#posts
 * @param { String } postId 
 * @param { String } content 
 * @param { Object } user 
 * @param { String } user.username 
 * @param { String } user.profilePic
 * @param { String } user.firstName 
 * @param { String } user.lastName 
 * @param { Timestamp } createdAt 
 */
function addNewPost(postId, content, user, createdAt) {
  const postsDiv = document.querySelector('#posts');
  const postElement = document.createElement('div')

  postElement.className = `post-wrapper w-full border-b-2 border-brand-light-gray flex flex-row space-x-5 py-3 px-8 justify-between`;
  postElement.dataset.pid = postId;
  postElement.innerHTML = createPostHTML(content, user, createdAt)
  postsDiv.prepend(postElement)
}

/**
 * Creates html string for post.  
 * @param { String } content 
 * @param { Object } user 
 * @param { String } user.username 
 * @param { String } user.profilePic
 * @param { String } user.firstName 
 * @param { String } user.lastName 
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
      <img 
        class="rounded-full bg-white" 
        src="${profilePic}" 
        alt="${username} profile pic" 
      />
    </div>

    <div class='post-content-container flex flex-col w-full'>
      <div class='post-content__info flex flex-row items-center w-full'>
        <div class="post-content-info__username-container">
          <p class="name font-bold">${firstName} ${lastName} -</p>
        </div>
        
        <div class="post-content-info__email-container ml-1">
          <p class="username text-brand-blue font-medium"> @${username} </p>
        </div>
        
        <div class="post-content-info__time-container ml-1">
          <p class="time font-normal">- ${createdAt}</p>
        </div>
      </div>

      <div class="post-content__text w-full mt-1">
        <p>${content}</p>
      </div>

      <div class='w-full flex flex-row justify-end mt-2'> 
        <div class="post-content__buttons flex flex-row">
          <button class='ml-3'>
            <i class="far fa-comment text-brand-purple text-xl cursor-pointer hover:text-brand-purple hover:text-opacity-75 hover:-translate-y-0.5 transform"></i>
          </button>
          <button class='retweet-post ml-3'>
            <i class="fas fa-retweet text-brand-purple text-xl cursor-pointer hover:text-brand-purple hover:text-opacity-75 hover:-translate-y-0.5 transform"></i>
          </button>
          <button class='post-like ml-3' onClick="onClickLikePost">
            <i class="far fa-heart text-brand-purple text-xl cursor-pointer hover:text-brand-purple hover:text-opacity-75 hover:-translate-y-0.5 transform"></i>
          </button>
        </div>
      </div>
    </div>`
}
/**
 * 
 * @param {HTMLElement} icon 
 * @param {String} firstClassToRemove 
 * @param {String} firstClassToAdd 
 */
function changeIconAfterAction(icon, firstClassToRemove, firstClassToAdd) {
  if (icon.classList.contains(firstClassToRemove)) {
    icon.classList.remove(firstClassToRemove)
    icon.classList.add(firstClassToAdd)
  } else {
    icon.classList.add(firstClassToRemove)
    icon.classList.remove(firstClassToAdd)
  }
}
/**
 * Recursively finds data-pid prop
 * @param { HTMLElement } element 
 * @returns boolean | string
 */
function findPostId(element) {
  if (['body', 'head', 'html'].includes(element.tagName.toLowerCase())) {
    return false;
  }

  if (element.tagName.toLowerCase() == 'div' && element.classList.contains('post-wrapper')) {
    const pid = element.dataset.pid;

    if (!pid) {
      return false;
    }

    return pid;
  }

  return findPostId(element.parentElement);
}

/**
 * Hides spinner inside of button for posting new post
 * @param {HTMLElement} postButtonLabel 
 * @param {HTMLElement} postButtonSpinner 
 */
function hideSpinner(postButtonLabel, postButtonSpinner) {
  disableButton(postButtonSpinner.parentElement);
  postButtonLabel.classList.remove('post-button--hidden')
  postButtonSpinner.classList.add('post-button--hidden')
}

/**
 * Shows spinner inside of button for posting new post
 * @param {HTMLElement} postButtonLabel 
 * @param {HTMLElement} postButtonSpinner 
 */
function showSpinner(postButtonLabel, postButtonSpinner) {
  postButtonLabel.classList.add('post-button--hidden')
  postButtonSpinner.classList.remove('post-button--hidden')
  disableButton(postButtonSpinner.parentElement);
}

export {
  enableButton,
  disableButton,
  addNewPost,
  hideSpinner,
  showSpinner,
  changeIconAfterAction,
  findPostId
}
