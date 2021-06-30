import { createPost, replyToPost } from './utils/api';
import { addNewPost, showSpinner, hideSpinner, setSeparatorHeightForAllReplies, toggleButtonAvailability, defineEmojiTooltip, addSelectedImagesToPreview } from './utils/dom-manipulation';
import { addEmojiToInput, addAllListenersToPosts } from './utils/listeners';
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
        console.log("🚀 ~ file: index.js ~ line 67 ~ submitPostButton.addEventListener ~ selectedImagesForPost", selectedImagesForPost)

        createPost(postContentValue, selectedImagesForPost)
          .then(res => res.json())
          .then(res => {
            postContentTextbox.value = '';
            resetImagePreview()
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
        console.log("🚀 ~ file: listeners.js ~ line 593 ~ selectedImagesForComment", selectedImagesForComment)

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

  function resetImagePreview() {
    uploadPreview.innerHTML = '';
    uploadPreview.classList.add('hidden')
    selectedImagesForPost = []
  }

  function validateAndPreviewImages(e) {
    if (validateNumberOfImages(e)) {
      uploadPreview.innerHTML = '';
      uploadPreview.classList.remove('hidden')
      selectedImagesForPost = Array.from(e.target.files)

      addSelectedImagesToPreview(uploadPreview, e.target.files, (e, img) => {
        const imageId = img.dataset.imageId;
        const deletedImage = selectedImagesForPost.find(file => imageId == `${file.lastModified}-${file.name}`)

        selectedImagesForPost = selectedImagesForPost.filter(file => file != deletedImage)
        const imageWrapper = document.querySelector(`.image-wrapper img[data-image-id="${deletedImage.lastModified}-${deletedImage.name}"]`).parentElement;
        imageWrapper.remove()
        console.log("🚀 ~ file: listeners.js ~ line 593 ~ selectedImagesForPost", selectedImagesForPost)

        if (selectedImagesForPost.length == 0) {
          uploadPreview.classList.add('hidden')
        }
      })

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
          location.reload()
        }
      })
      .catch(err => {
        hideSpinner(commentButtonLabel, commentButtonSpinner)
        alert(err)
        console.error(err)
      });
  }


}