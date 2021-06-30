import { createPost } from './utils/api';
import { addNewPost, showSpinner, hideSpinner, setSeparatorHeightForAllReplies, toggleButtonAvailability, defineEmojiTooltip, addSelectedImagesToPreview } from './utils/dom-manipulation';
import { addEmojiToInput, addAllListenersToPosts } from './utils/listeners';
import { validateNumberOfImages } from './utils/validation';

export default function index() {
  var selectedImages = []
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
          () => taPost.value.trim() == 0 && selectedImages.length == 0,
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

  addAllListenersToPosts()

  setSeparatorHeightForAllReplies()

  /**
  * @param {Event} e 
  */
  function checkInsertPostTextArea(e) {
    const postValue = e.target.value;
    const postBtn = document.querySelector('button#submitPostButton')

    toggleButtonAvailability(
      postBtn,
      () => postValue.trim() == 0 && selectedImages.length == 0,
      'bg-opacity-100'
    )

    postBtn.disabled = postValue.trim().length == 0 && selectedImages.length == 0;
  }

  function validateAndPreviewImages(e) {
    if (validateNumberOfImages(e)) {
      uploadPreview.innerHTML = '';
      uploadPreview.classList.remove('hidden')
      addSelectedImagesToPreview(uploadPreview, e.target.files, onRemoveImage)
      selectedImages = Array.from(e.target.files)

      toggleButtonAvailability(
        submitPostButton,
        () => taPost.value.trim() == 0 && selectedImages.length == 0,
        'bg-opacity-100'
      )

    } else {
      uploadPreview.classList.add('hidden')
      selectedImages = []
    }
  }

  function onRemoveImage(e, img) {
    const imageId = img.dataset.imageId;
    const deletedImage = selectedImages.find(file => imageId == `${file.lastModified}-${file.name}`)

    selectedImages = selectedImages.filter(file => file != deletedImage)
    const imageWrapper = document.querySelector(`.image-wrapper img[data-image-id="${deletedImage.lastModified}-${deletedImage.name}"]`).parentElement;
    imageWrapper.remove()

    if (selectedImages.length == 0) {
      uploadPreview.classList.add('hidden')
    }
  }
}