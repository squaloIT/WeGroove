import { addNewPostWithPredefinedButtons, addSelectedImagesToPreview, createSearchResultRowElement, hideSpinner, setSeparatorHeightForAllReplies, showSpinner, toggleButtonAvailability } from "./utils/dom-manipulation"
import { addAllListenersToPosts, onFollowOrUnfollowClick, validateAndPreviewImagesForComment } from "./utils/listeners"
import { replyToPost, searchTermByType } from './utils/api'
import { validateNumberOfImages } from "./utils/validation"

export default function search() {
  var selectedImagesForComment = []

  document.querySelector('div.reply-button-wrapper button.reply-comment-button')
    .addEventListener('click', onClickCommentButton)

  addAllListenersToPosts((e) => {
    const uploadPreview = document.querySelector('#modal-container div.upload-images-preview-wrapper');
    const taReply = document.querySelector("#modal-container div.reply-aria textarea")
    const submitCommentBtn = document.querySelector('div.reply-button-wrapper button.reply-comment-button')

    if (validateNumberOfImages(e)) {
      uploadPreview.innerHTML = '';
      uploadPreview.classList.remove('hidden')
      selectedImagesForComment = Array.from(e.target.files)
      addSelectedImagesToPreview(uploadPreview, e.target.files, (e, img) => {
        const imageId = img.dataset.imageId;
        const deletedImage = selectedImagesForComment.find(file => imageId == `${file.lastModified}-${file.name}`)

        selectedImagesForComment = selectedImagesForComment.filter(file => file != deletedImage)
        const imageWrapper = document.querySelector(`.image-wrapper img[data-image-id="${deletedImage.lastModified}-${deletedImage.name}"]`).parentElement;
        imageWrapper.remove()

        if (selectedImagesForComment.length == 0) {
          uploadPreview.classList.add('hidden')
        }
      })

      toggleButtonAvailability(
        submitCommentBtn,
        () => taReply.value.trim() == 0 && selectedImagesForComment.length == 0,
        'bg-opacity-100'
      )

    } else {
      uploadPreview.classList.add('hidden')
      selectedImagesForComment = []
    }
  })

  Array.from(
    document.querySelectorAll('div#profile div.profile-follow-buttons button.following-unfollowing')
  ).forEach(el => {
    el.addEventListener('click', e => onFollowOrUnfollowClick(e, e.target.classList.contains('follow-button') ? 'follow' : 'unfollow'))
  })

  /** @type { HTMLElement } */
  const searchResults = document.querySelector('div#search-results')

  var timer = null;
  document.querySelector('input#search').addEventListener('keyup', function (e) {
    clearTimeout(timer);
    const value = e.target.value;
    const searchType = e.target.dataset.type;

    timer = setTimeout(() => {
      searchResults.innerHTML = ''
      if (value === '') {
        searchResults.innerHTML = ''
      } else {

        searchTermByType(searchType, value)
          .then(({ data }) => {
            data.forEach(elem => {
              if (searchType == 'posts') {
                addNewPostWithPredefinedButtons(searchResults, elem)
              }
              else if (searchType === 'users') {
                const div = createSearchResultRowElement(elem, true)
                searchResults.append(div);
              }
            })
          })
          .catch(err => {
            console.error(err)
          })
      }

    }, 1000)
  });

  setSeparatorHeightForAllReplies()


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
    console.log(selectedImagesForComment)
    replyToPost(pid, content, selectedImagesForComment)
      .then(res => res.json())
      .then(({ status }) => {
        if (status == 201) {
          hideSpinner(commentButtonLabel, commentButtonSpinner);
          // location.reload()
        }
      })
      .catch(err => {
        hideSpinner(commentButtonLabel, commentButtonSpinner)
        alert(err)
        console.error(err)
      });
  }
}
