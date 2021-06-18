import { likePost, retweetPost, getPostData, replyToPost, deletePostByID, followOrUnfollowUser, togglePinned } from "./api";
import { animateButtonAfterClickOnLike, animateButtonAfterClickOnRetweet, showSpinner, hideSpinner, findPostWrapperElement, openModal, toggleButtonAvailability, toggleScrollForTextarea, getPostIdForWrapper, getProfileIdFromFollowButton, toggleFollowButtons, emptyImagePreviewContainer, emptyFileContainer } from "./dom-manipulation";

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
  const button = e.target;
  const postWrapper = findPostWrapperElement(button, 'post-wrapper') || findPostWrapperElement(button, 'original-post') || findPostWrapperElement(button, 'comment-post');

  if (!postWrapper) {
    alert("Couldnt find post id")
    return;
  }

  const pid = getPostIdForWrapper(postWrapper)
  const otherPostLikeButtonsOnThePageWithSamePostID = document.querySelectorAll(`div.post-wrapper[data-pid="${pid}"] button.post-like, div.post-wrapper[data-retweet-id="${pid}"] button.post-like, div.original-post[data-pid="${pid}"] button.post-like, div.comment-post[data-pid="${pid}"] button.post-like`)

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
  const postWrapper = findPostWrapperElement(button, 'post-wrapper') || findPostWrapperElement(button, 'original-post') || findPostWrapperElement(button, 'comment-post');

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
  const postWrapper = findPostWrapperElement(button, 'post-wrapper') || findPostWrapperElement(button, 'original-post') || findPostWrapperElement(button, 'comment-post');

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
  toggleButtonAvailability(postBtn, () => e.target.value.trim().length == 0)
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
  const postWrapper = findPostWrapperElement(e.target, 'post-wrapper') || findPostWrapperElement(e.target, 'original-post') || findPostWrapperElement(e.target, 'comment-post');


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
  const postWrapper = findPostWrapperElement(e.target, 'post-wrapper') || findPostWrapperElement(e.target, 'original-post') || findPostWrapperElement(e.target, 'comment-post');

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

function onFollowOrUnfollowClick(e, action) {
  const profileId = getProfileIdFromFollowButton(e);

  const label = e.target.querySelector('span.follow-button__label')
  const spinner = e.target.querySelector('i.follow-button__spinner')

  showSpinner(label, spinner)
  var spanToChange = document.querySelector('div.following-info-wrapper span.number-of-followers');

  followOrUnfollowUser(profileId, action)
    .then(data => {
      console.log(data);
      toggleFollowButtons(e, label, spanToChange);
      hideSpinner(label, spinner)
    })
    .catch(err => {
      console.error(err)
      alert(`Problem with ${action}, please try again after later thank you.`)
    })
}
/**
 * 
 * @param { Event } e 
 * @param { String } type 
 * @param { Object | null } cropper 
 */
function openPhotoEditModal(e, type, cropper) {
  const modal = document.querySelector("#change-photo-modal");
  modal.classList.remove('hidden')
  const closebutton = modal.querySelector('.close-modal-button')
  closebutton.addEventListener('click', e => modal.classList.add('hidden'))

  /** @type {HTMLElement} */
  const inputFile = modal.querySelector('input[type="file"]')
  // emptyImagePreviewContainer();
  // emptyFileContainer();

  inputFile.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (e.target && e.target.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const previewImage = document.querySelector('div#image-preview > img');
        previewImage.src = e.target.result;

        if (cropper.instance) {
          cropper.instance.destroy();
          // emptyImagePreviewContainer();
          // emptyFileContainer();
        }

        cropper.instance = new Cropper(previewImage, {
          aspectRatio: type == 'profile' ? 1 / 1 : 16 / 9,
          background: false
        })
      }
      reader.readAsDataURL(file)
    }
  });

  inputFile.dataset.type = type;
}
/**
 * 
 * @param {Event} e 
 * @param {Object} cropper 
 */
function onClosePhotoModal(e, cropper) {
  document.querySelector("#change-photo-modal").classList.add('hidden')
  if (cropper.instance) {
    cropper.instance.destroy();
  }
  emptyImagePreviewContainer();
  emptyFileContainer()
}

function onClickUploadImageToServer(e, cropper) {
  var canvas = cropper.instance.getCroppedCanvas();
  if (!canvas) {
    alert("Couldn't upload image, make sure that it is an image file")
    return;
  }
  const photoSaveLabel = e.target.querySelector('span.photo-save__label')
  const photoSaveSpinner = e.target.querySelector('i.photo-save__spinner')
  showSpinner(photoSaveLabel, photoSaveSpinner)

  canvas.toBlob((blob) => {
    var formData = new FormData()
    formData.append('croppedImage', blob)
    const typeOfPhotoToUpload = document.querySelector('input#photo').dataset.type;

    fetch(`/profile/upload/${typeOfPhotoToUpload}`, {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(({ status }) => {
        hideSpinner(photoSaveLabel, photoSaveSpinner)
        if (status === 200) {
          location.reload()
        }
      })
      .catch(err => {
        console.error(err)
      })
  });
}
/**
 * 
 * @param {Event} e 
 * @returns {Promise<post>}
 */
function onClickTogglePinned(e) {
  e.stopPropagation();
  const button = e.target
  const postWrapper = findPostWrapperElement(button, 'post-wrapper') || findPostWrapperElement(button, 'original-post') || findPostWrapperElement(button, 'comment-post');
  console.log(button.dataset)
  const pinned = button.dataset.pinned == 'true';
  // const isProfilePage = document.querySelector("div#profile-posts div.pinned-button-wrapper");

  if (!postWrapper) {
    alert("Couldnt find post id")
    return;
  }

  const pid = getPostIdForWrapper(postWrapper)
  togglePinned(pid, pinned)
    .then(({ data, msg, status }) => {
      if (status == 200) {
        location.reload();
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
  onClosePhotoModal,
  openPhotoEditModal,
  onPostWrapperClick,
  onClickTogglePinned,
  onClickUploadImageToServer,
  onFollowOrUnfollowClick
}