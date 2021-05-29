import { likePost, retweetPost, getPostData } from "./api";
import { animateButtonAfterClickOnLike, animateButtonAfterClickOnRetweet, findPostId, openModal } from "./dom-manipulation";

function onClickLikePost(e) {
  const likeButton = e.target;
  const pid = findPostId(likeButton);

  const otherPostLikeButtonsOnThePageWithSamePostID = document.querySelectorAll(`div.post-wrapper[data-pid="${pid}"] button.post-like`)

  likePost(pid)
    .then(res => res.json())
    .then(res => {
      Array.from(otherPostLikeButtonsOnThePageWithSamePostID)
        .forEach(button => {
          animateButtonAfterClickOnLike(button, res.data.post.likes.length)
        })
    })
    .catch(err => console.error(err));
}

function onClickRetweetPost(e) {
  const button = e.target;
  const pid = findPostId(button);

  retweetPost(pid)
    .then(res => res.json())
    .then(res => {
      animateButtonAfterClickOnRetweet(button, res.data.post.retweetUsers.length)
    })
    .catch(err => console.error(err));
}

function onClickCommentPost(e) {
  const button = e.target;
  const pid = findPostId(button);
  //TODO - Do the rest

  getPostData(pid)
    .then(res => res.json())
    .then(({ msg, status, data }) => {
      if (status == 200) {
        openModal(data)
      }
    })
}

function onKeyUpCommentTA(e) {
  e.target.style.height = 'auto';

  if (e.target.scrollHeight > 150) {
    e.target.style.overflowY = 'scroll'
  } else {
    e.target.style.overflowY = 'hidden'
  }
  e.target.style.height = `${e.target.scrollHeight}`;
}

const createFunctionToCloseModal = (modal, taReply) => (e) => {
  modal.classList.add('hidden')
  taReply.value = '';
  taReply.style.height = '50px';
  taReply.style.overflowY = 'hidden'
  modal.querySelector('div.left-column__line-separator').style.height = '0px'
}

export {
  onClickLikePost,
  onClickCommentPost,
  onKeyUpCommentTA,
  createFunctionToCloseModal,
  onClickRetweetPost
}