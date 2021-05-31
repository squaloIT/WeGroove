import './../styles/tailwind.css';
import { onClickLikePost, onClickRetweetPost, onClickCommentPost, onClickCommentButton } from './utils/listeners';

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
