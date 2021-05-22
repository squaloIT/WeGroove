import { likePost, retweetPost } from "./api";
import { animateButtonAfterClickOnLike, animateButtonAfterClickOnRetweet, findPostId } from "./dom-manipulation";

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
}

export {
  onClickLikePost,
  onClickCommentPost,
  onClickRetweetPost
}