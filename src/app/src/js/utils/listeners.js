import { emitStopTypingToRoom, emitTypingToRoom } from "../client-socket";
import { likePost, retweetPost, getPostData, replyToPost, deletePostByID, followOrUnfollowUser, togglePinned, createChat, changeChatName, sendMessage, sendNotificationRead, getNumberOfUnreadForUser, setSeenForMessagesInChat } from "./api";
import { animateButtonAfterClickOnLike, animateButtonAfterClickOnRetweet, showSpinner, hideSpinner, findPostWrapperElement, openModal, toggleButtonAvailability, toggleScrollForTextarea, getPostIdForWrapper, getProfileIdFromFollowButton, toggleFollowButtons, emptyImagePreviewContainer, emptyFileContainer, addNewMessage, scrollMessagesToBottom, createNewNotification, createChatRow, findChatElement, addEmojiToCommentModal, addSelectedImagesToPreview } from "./dom-manipulation";
import { validateNumberOfImages } from "./validation";

/**
 * @param {Event} e 
 */
function onClickCommentButton(e) {
  e.stopPropagation();
  const pid = e.target.dataset.pid;
  const content = document.querySelector("div#modal-container div.reply-aria textarea").value;

  const commentButtonLabel = document.querySelector('div#modal-container div.reply-button-wrapper span.comment-button__label')
  const commentButtonSpinner = document.querySelector('div#modal-container div.reply-button-wrapper .comment-button__spinner')
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
  document.querySelector('#comment-images-for-upload').value = ''
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
          aspectRatio: type == 'profile' ? 1 / 1 : 3 / 1,
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
  const photoSaveLabel = e.target.querySelector('span.modal-save-button__label')
  const photoSaveSpinner = e.target.querySelector('i.modal-save-button__spinner')
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
/**
 * @param { Event } e 
 * @param { Array.<user> } selectedUsers 
 */
function onClickCreateChat(e, selectedUsers) {
  createChat(selectedUsers)
    .then(res => {
      window.location.href = '/messages/' + res.data._id
    })
    .catch(err => {
      console.error(err)
    })
}

/**
 * @param { Event } e 
 * @param { HTMLElement } modal 
 * @param { string } chatId 
 */
function onClickSaveChatNameButton(e, modal, chatId) {
  const chatNameElement = modal.querySelector('input#chat-name')
  const chatName = chatNameElement.value.trim()

  if (chatName.length > 0) {
    changeChatName(chatName, chatId)
      .then(res => {
        const chatNameHeader = document.querySelector('#inbox > div.chat-messages-wrapper > div.header-chat-info-wrapper > div > div.header-chat-name > h4');
        chatNameHeader.innerHTML = res.data.chatName;
        modal.classList.add('hidden')
        chatNameElement.value = ''
      })
      .catch(err => {
        console.error(err)
        alert("There was an error while trying to change chat name")
      })
  }
}

function addEmojiToInput(e, textarea) {
  //TODO dodati da se emoji dodaje na kraju 
  textarea.value += e.detail.unicode
}
/**
 * 
 * @param {Event} e 
 * @param {HTMLElement} messageInput 
 * @param {HTMLElement} chatMessagesContainer 
 */
function onSendMessage(e, messageInput, chatMessagesContainer) {
  const chatId = document.querySelector('#send-message-button').dataset.chatId;
  const content = messageInput.value.trim()

  sendMessage(chatId, content)
    .then(res => {
      addNewMessage(res.data, 'sent')
      messageInput.value = '';
      messageInput.focus()
      scrollMessagesToBottom(chatMessagesContainer)
      stopTyping(chatId)
    })
    .catch(err => {
      console.error(err)
      messageInput.value = content;
    })
}

var typing = false;
var lastTypingTime = 0;
/**
 * Emits event about typing or not typing by the user
 * @param {String} room 
 */
function updateTyping(room) {
  if (!typing) {
    typing = true;
    emitTypingToRoom(room)
  }

  lastTypingTime = new Date().getTime();
  var timerLength = 3000;

  setTimeout(() => {
    const timeNow = new Date().getTime();
    const timeDiff = timeNow - lastTypingTime;

    if (timeDiff >= timerLength) {
      stopTyping(room)
    }
  }, timerLength)
}

function stopTyping(room) {
  emitStopTypingToRoom(room)
  typing = false;
}

function onClickOnNotification(e) {
  e.preventDefault();
  /** @type { HTMLElement } */
  const aTag = e.target;
  const href = aTag.getAttribute('href');
  const notificationId = aTag.dataset.notificationId;

  if (!notificationId) {
    alert("No notification ID")
    return;
  }

  sendNotificationRead(notificationId)
    .then(data => {
      if (data.status == 200) {
        window.location.href = href;
      }
    })
    .catch(err => {
      console.log(err);
      alert("There was a problem with viewing notification, please try again later thank you.")
    })
}
/**
 * 
 * @param {message} msg 
 */
function onNewMessage(msg) {
  const chatContainer = document.querySelector('#inbox div.chat-messages-container')
  const inboxChatsWrapper = document.querySelector('#inbox #chats')

  //* This means that I am in the chat so no notification should be fetched and displayed
  if (chatContainer) {
    addNewMessage(msg, 'received')
    scrollMessagesToBottom(chatContainer)
    setSeenForMessagesInChat(msg.chat._id || msg.chat)
      .then(data => console.log(data.msg))
      .catch(err => console.error(err));

    return
  }

  if (inboxChatsWrapper) {
    const chatElement = findChatElement(msg.chat._id || msg.chat, inboxChatsWrapper)
    if (chatElement) {
      chatElement.classList.add('bg-comment-button-blue-background')
      chatElement.querySelector('div.chat-info-messages h4').classList.add('font-semibold')
      const contentEl = chatElement.querySelector('div.chat-info-messages p');
      contentEl.classList.add('font-medium')
      contentEl.innerText = msg.content;

    } else {
      const chatRow = createChatRow(msg)
      inboxChatsWrapper.prepend(chatRow);
    }

  } else {
    getNumberOfUnreadForUser()
      .then(data => {
        const numOfChatsSpan = document.querySelector("#numOfUnreadChats")
        if (numOfChatsSpan && data.data > 0) {
          numOfChatsSpan.classList.add('bg-red-700')
          numOfChatsSpan.innerText = data.data
        }
      })
  }

}
/**
 * 
 * @param {Object} data 
 * @param {notification} data.notification 
 * @param {Number} data.notificationNumber 
 */
function onNewNotification(data) {
  const numOfNotificationsSpan = document.querySelector("#numOfUnreadNotifications");
  const notificationsContainer = document.querySelector('#notifications div.content-wrapper')
  data = JSON.parse(data)

  //* If true means that we are on notifications page
  if (notificationsContainer) {
    //TODO - add new notification to screen
    const newNotificationElement = createNewNotification(data.notification)
    notificationsContainer.prepend(newNotificationElement)
  } else {
    if (numOfNotificationsSpan && data.notificationNumber > 0) {
      numOfNotificationsSpan.classList.add('bg-red-700')
      numOfNotificationsSpan.innerText = data.notificationNumber
    }
  }
}

function addAllListenersToPosts(validateAndPreviewImages = null) {
  addEmojiToCommentModal()

  document.querySelector('div.reply-button-wrapper button.reply-comment-button')
    .addEventListener('click', onClickCommentButton)

  if (validateAndPreviewImages) {
    const commentUploadImagesInput = document.querySelector('#comment-images-for-upload');

    document.querySelector('div.reply-icons-wrapper button.comment-image-button')
      .addEventListener('click', () => {
        commentUploadImagesInput.click()
        commentUploadImagesInput.removeEventListener('change', validateAndPreviewImages)
        commentUploadImagesInput.addEventListener('change', validateAndPreviewImages)
      })
  }

  Array.from(document.querySelectorAll('.comment-button')).forEach(el => {
    el.addEventListener('click', onClickCommentPost)
  })

  Array.from(document.querySelectorAll('.post-like')).forEach(el => {
    el.addEventListener('click', onClickLikePost)
  })

  Array.from(document.querySelectorAll('.retweet-post')).forEach(el => {
    el.addEventListener('click', onClickRetweetPost)
  })

  Array.from(document.querySelectorAll('.post-wrapper')).forEach(el => {
    el.addEventListener('click', onPostWrapperClick)
  })

  Array.from(
    document.querySelectorAll('div.post-wrapper div.delete-post-button-wrapper button.delete-post-button')
  ).forEach(el => {
    el.addEventListener('click', onClickDeletePost)
  })

  Array.from(
    document.querySelectorAll('#posts div.post-content__info.flex.flex-row.items-center.w-full div.pinned-button-wrapper.inline-block > button')
  ).forEach(el => {
    el.addEventListener('click', onClickTogglePinned)
  })
  document.querySelector('#comment-images-for-upload').addEventListener('change', validateNumberOfImages)
}

const onClickRemoveImage = (selectedImages, uploadPreview) => (e, img) => {
  const imageId = img.dataset.imageId;
  const deletedImage = selectedImages.find(file => imageId == `${file.lastModified}-${file.name}`)

  selectedImages = selectedImages.filter(file => file != deletedImage)
  const imageWrapper = document.querySelector(`.image-wrapper img[data-image-id="${deletedImage.lastModified}-${deletedImage.name}"]`).parentElement;
  imageWrapper.remove()
  console.log("🚀 ~ file: listeners.js ~ line 593 ~ selectedImages", selectedImages)

  if (selectedImages.length == 0) {
    uploadPreview.classList.add('hidden')
  }
}

const validateAndPreviewImagesForComment = (selectedImages) => (e) => {
  const uploadPreview = document.querySelector('#modal-container div.upload-images-preview-wrapper');
  const taReply = document.querySelector("#modal-container div.reply-aria textarea")
  const submitCommentBtn = document.querySelector('div.reply-button-wrapper button.reply-comment-button')

  if (validateNumberOfImages(e)) {
    uploadPreview.innerHTML = '';
    uploadPreview.classList.remove('hidden')
    selectedImages = Array.from(e.target.files)
    addSelectedImagesToPreview(uploadPreview, e.target.files, onClickRemoveImage(selectedImages, uploadPreview))

    toggleButtonAvailability(
      submitCommentBtn,
      () => taReply.value.trim() == 0 && selectedImages.length == 0,
      'bg-opacity-100'
    )

  } else {
    uploadPreview.classList.add('hidden')
    selectedImages = []
  }
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
  onFollowOrUnfollowClick,
  onClickSaveChatNameButton,
  onClickCreateChat,
  addEmojiToInput,
  onSendMessage,
  updateTyping,
  stopTyping,
  onClickOnNotification,
  onNewMessage,
  onClickRemoveImage,
  addAllListenersToPosts,
  validateAndPreviewImagesForComment,
  onNewNotification
}