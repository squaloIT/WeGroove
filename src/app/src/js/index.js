import { disableButton, enableButton } from './utils/dom-manipulation';

document.querySelector('textarea#post')
  .addEventListener('keyup', function (e) {
    const postValue = e.target.value;
    const postBtn = document.querySelector('button#submitPostButton')

    if (postValue.trim().length == 0) {
      disableButton(postBtn)
    } else {
      enableButton(postBtn)
    }

    postBtn.disabled = postValue.trim().length == 0
  })

document.querySelector('button#submitPostButton')
  .addEventListener('click', e => {
    const postContentTextbox = document.querySelector('textarea#post')
    const postContentValue = postContentTextbox.value.trim();

    if (postContentValue.length > 0) {
      fetch(`${process.env.SERVER_URL_DEV}/api/posts`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          content: postContentValue
        })
      })
        .then(res => res.json())
        .then(json => {
          postContentTextbox.value = '';
        })
        .catch(err => {
          console.err(err)
          alert("Ooops, there was an error trying to save your post...")
        })
    }
  })