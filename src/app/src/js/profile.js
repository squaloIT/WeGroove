import { onClickCommentButton, onClickCommentPost, onClickDeletePost, onClickLikePost, onClickRetweetPost, onPostWrapperClick } from "./utils/listeners"

export default function profile() {
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

}