import { setSeparatorHeightForAllReplies } from "./utils/dom-manipulation"
import { onClickCommentButton, onClickCommentPost, onClickDeletePost, onClickLikePost, onClickRetweetPost, onClickTogglePinned, onClickUploadImageToServer, onClosePhotoModal, onFollowOrUnfollowClick, onPostWrapperClick, openPhotoEditModal } from "./utils/listeners"

export default function profile() {
  const cropper = {
    instance: null
  };

  document.querySelector('div.reply-button-wrapper button.reply-comment-button')
    .addEventListener('click', onClickCommentButton)

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
    document.querySelectorAll('div#profile div.profile-follow-buttons button.following-unfollowing')
  ).forEach(el => {
    el.addEventListener('click', e => onFollowOrUnfollowClick(e, e.target.classList.contains('follow-button') ? 'follow' : 'unfollow'))
  })

  Array.from(
    document.querySelectorAll('#profile-posts div.post-content__info.flex.flex-row.items-center.w-full div.pinned-button-wrapper.inline-block > button')
  ).forEach(el => {
    el.addEventListener('click', onClickTogglePinned)
  })

  const profilePhotoIcon = document.querySelector('div.profile-picture-container i.fa-camera-retro')
  const coverPhotoIcon = document.querySelector('div.profile-cover-picture i.fa-camera-retro')

  if (profilePhotoIcon && coverPhotoIcon) {
    profilePhotoIcon.addEventListener('click', e => openPhotoEditModal(e, 'profile', cropper))
    coverPhotoIcon.addEventListener('click', e => openPhotoEditModal(e, 'cover', cropper))

    document.querySelector("button.save-modal-button").addEventListener('click', e => onClickUploadImageToServer(e, cropper))
    document.querySelector("button.cancel-modal-button").addEventListener('click', e => onClosePhotoModal(e, cropper))
  }

  setSeparatorHeightForAllReplies()
}
