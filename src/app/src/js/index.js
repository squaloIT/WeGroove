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

function enableButton(postBtn) {
  postBtn.classList.add('hover:bg-brand-purple-hover');
  postBtn.classList.add('cursor-pointer');
  postBtn.classList.remove('cursor-auto');
  postBtn.classList.remove('bg-opacity-50');
}

function disableButton(postBtn) {
  postBtn.classList.add('bg-opacity-50');
  postBtn.classList.add('cursor-auto');
  postBtn.classList.remove('hover:bg-brand-purple-hover');
  postBtn.classList.remove('cursor-pointer');
}