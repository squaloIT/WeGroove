function enableButton(postBtn) {
  postBtn.classList.add('hover:bg-brand-purple-hover');
  postBtn.classList.add('cursor-pointer');
  postBtn.classList.remove('cursor-auto');
  postBtn.classList.remove('bg-opacity-50');
}

function disableButton(postBtn) {
  postBtn.classList.add('bg-opacity-50');
  postBtn.classList.add('cursor-auto');
  postBtn.classList.remove('hover:bg-brand-purple-hover');
  postBtn.classList.remove('cursor-pointer');
}

function addNewPost(postId, content, user, createdAt) {
  const postsDiv = document.querySelector('#posts');
  const contentAlreadyExists = postsDiv.innerHTML;
  let futureContent = `${createPostHTML(postId, content, user, createdAt)} ${contentAlreadyExists}`;
  postsDiv.innerHTML = futureContent;
}

function createPostHTML(postId, content, user, createdAt) {
  const {
    _id,
    profilePic,
    username,
    firstName,
    lastName
  } = user;

  return `<div class='post-wrapper w-full border-b-2 border-brand-light-gray flex flex-row space-x-5 py-3 px-8 justify-between'>
    <div class="post__image-container w-14 h-14">
      <img 
        class="rounded-full bg-white" 
        src="${profilePic}" 
        alt="${username} profile pic" 
      />
    </div>

    <div class='post-content-container flex flex-col w-full'>
      <div class='post-content__info flex flex-row space-x-3 items-center w-full'>
        <div class="post-content-info__username-container">
          <p class="name font-bold">${firstName} ${lastName}</p>
        </div>
        
        <div class="post-content-info__email-container">
          <p class="username">@${username}</p>
        </div>
        
        <div class="post-content-info__time-container">
          <p class="time">${createdAt}</p>
        </div>
      </div>

      <div class="post-content__text w-full mt-1">
        <p>${content}</p>
      </div>

      <div class='w-full flex flex-row justify-end mt-2'> 
        <div class="post-content__buttons flex flex-row space-x-3">
          <button data-pid="${postId}">
            <i class="fas fa-retweet text-brand-purple text-xl cursor-pointer hover:text-brand-purple hover:text-opacity-75 hover:-translate-y-0.5 transform"></i>
          </button>
          <button data-pid="${postId}">
            <i class="far fa-comment text-brand-purple text-xl cursor-pointer hover:text-brand-purple hover:text-opacity-75 hover:-translate-y-0.5 transform"></i>
          </button>
          <button data-pid="${postId}">
            <i class="far fa-heart text-brand-purple text-xl cursor-pointer hover:text-brand-purple hover:text-opacity-75 hover:-translate-y-0.5 transform"></i>
          </button>
        </div>
      </div>
    </div>
  </div>`
}

export {
  enableButton,
  disableButton,
  addNewPost
}
