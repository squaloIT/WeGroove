import { createPost } from './utils/api';
import { addNewPost, showSpinner, hideSpinner, setSeparatorHeightForAllReplies, toggleButtonAvailability, defineEmojiTooltip, addSelectedImagesToPreview } from './utils/dom-manipulation';
import { addEmojiToInput, addAllListenersToPosts, onClickRemoveImage, validateAndPreviewImagesForComment } from './utils/listeners';
import { validateNumberOfImages } from './utils/validation';

export default function index() {
  var selectedImagesForPost = []
  var selectedImagesForComment = []
  const taPost = document.querySelector('textarea#post');
  const emojiButton = document.querySelector('#emoji-button');
  const submitPostButton = document.querySelector('button#submitPostButton')

  const uploadImagesInput = document.querySelector('#post-images-for-upload')
  const uploadPreview = document.querySelector('div.post-insert-wrapper div.textarea-container div.upload-images-preview-wrapper');

  document.querySelector('button#add-post-image-button').addEventListener('click', () => {
    uploadImagesInput.click()
    uploadImagesInput.removeEventListener('change', validateAndPreviewImages)
    uploadImagesInput.addEventListener('change', validateAndPreviewImages)
  })

  if (emojiButton) {
    defineEmojiTooltip(
      emojiButton,
      document.querySelector('#insert-post-emojis-tooltip'),
      (e) => {
        toggleButtonAvailability(
          submitPostButton,
          () => taPost.value.trim() == 0 && selectedImagesForPost.length == 0,
          'bg-opacity-100'
        )

        addEmojiToInput(e, taPost)
      }
    )
  }

  if (taPost) {
    taPost.addEventListener('keyup', checkInsertPostTextArea);
  }

  const taReply = document.querySelector("div.reply-aria textarea")
  taReply.addEventListener('keyup', function (e) {
    if (e.target.scrollHeight > 110) {
      e.target.style.overflowY = 'scroll'
    } else {
      e.target.style.overflowY = 'hidden'
      e.target.style.height = `${e.target.scrollHeight}`;
    }

  });

  if (submitPostButton) {
    submitPostButton.addEventListener('click', () => {
      const postContentTextbox = document.querySelector('textarea#post')
      const postContentValue = postContentTextbox.value.trim();

      const postButtonLabel = document.querySelector('.post-button__label')
      const postButtonSpinner = document.querySelector('.post-button__spinner')
      showSpinner(postButtonLabel, postButtonSpinner)

      if (postContentValue.length > 0) {
        createPost(postContentValue)
          .then(res => res.json())
          .then(res => {
            postContentTextbox.value = '';
            const targetElement = document.querySelector('#posts');
            addNewPost(targetElement, res.data.createdPost, "moments ago");
            hideSpinner(postButtonLabel, postButtonSpinner)
          })
          .catch(err => {
            console.error(err)
            alert("Ooops, there was an error trying to save your post...")
          })
      } else {
        hideSpinner(postButtonLabel, postButtonSpinner)
      }
    })
  }

  addAllListenersToPosts(validateAndPreviewImagesForComment(selectedImagesForComment))

  setSeparatorHeightForAllReplies()

  /**
  * @param {Event} e 
  */
  function checkInsertPostTextArea(e) {
    const postValue = e.target.value;
    const postBtn = document.querySelector('button#submitPostButton')

    toggleButtonAvailability(
      postBtn,
      () => postValue.trim() == 0 && selectedImagesForPost.length == 0,
      'bg-opacity-100'
    )

    postBtn.disabled = postValue.trim().length == 0 && selectedImagesForPost.length == 0;
  }

  function validateAndPreviewImages(e) {
    if (validateNumberOfImages(e)) {
      uploadPreview.innerHTML = '';
      uploadPreview.classList.remove('hidden')
      selectedImagesForPost = Array.from(e.target.files)
      addSelectedImagesToPreview(uploadPreview, e.target.files, onClickRemoveImage(selectedImagesForPost, uploadPreview))

      toggleButtonAvailability(
        submitPostButton,
        () => taPost.value.trim() == 0 && selectedImagesForPost.length == 0,
        'bg-opacity-100'
      )

    } else {
      uploadPreview.classList.add('hidden')
      selectedImagesForPost = []
    }
  }


}