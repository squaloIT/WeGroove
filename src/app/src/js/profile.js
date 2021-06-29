import { setSeparatorHeightForAllReplies } from "./utils/dom-manipulation"
import { addAllListenersToPosts, onClickUploadImageToServer, onClosePhotoModal, onFollowOrUnfollowClick, openPhotoEditModal } from "./utils/listeners"

export default function profile() {
  const cropper = {
    instance: null
  };

  addAllListenersToPosts()

  Array.from(
    document.querySelectorAll('div#profile div.profile-follow-buttons button.following-unfollowing')
  ).forEach(el => {
    el.addEventListener('click', e => onFollowOrUnfollowClick(e, e.target.classList.contains('follow-button') ? 'follow' : 'unfollow'))
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
