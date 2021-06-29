import { createPost } from './utils/api';
import { disableButton, enableButton, addNewPost, showSpinner, hideSpinner, setSeparatorHeightForAllReplies, toggleButtonAvailability, defineEmojiTooltip } from './utils/dom-manipulation';
import { addEmojiToInput, addAllListenersToPosts } from './utils/listeners';
import { validateNumberOfImages } from './utils/validation';

export default function index() {
  const taPost = document.querySelector('textarea#post');
  const emojiButton = document.querySelector('#emoji-button');
  const submitPostButton = document.querySelector('button#submitPostButton')

  document.querySelector('button#add-post-image-button').addEventListener('click', () => {
    document.querySelector('#post-images-for-upload').click()
    document.querySelector('#post-images-for-upload').addEventListener('change', validateNumberOfImages)
  })

  if (emojiButton) {
    defineEmojiTooltip(
      emojiButton,
      document.querySelector('#insert-post-emojis-tooltip'),
      (e) => {
        toggleButtonAvailability(
          submitPostButton,
          () => taPost.value.trim() == 0,
          'hover:bg-comment-button-blue-background'
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

    if (postValue.trim().length == 0) {
      disableButton(postBtn, 'hover:bg-comment-button-blue')
    } else {
      enableButton(postBtn, 'hover:bg-comment-button-blue')
    }

    postBtn.disabled = postValue.trim().length == 0;
  }
}