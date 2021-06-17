import { addNewPost, setSeparatorHeightForAllReplies } from "./utils/dom-manipulation"
import { onClickCommentButton, onClickCommentPost, onClickDeletePost, onClickLikePost, onClickRetweetPost, onClickTogglePinned, onFollowOrUnfollowClick, onPostWrapperClick } from "./utils/listeners"
import { searchTermByType } from './utils/api'
import { createCommentButtonElements, createDeleteButtonElements, createElementForButtonWrapper, createLikeButtonElements, createPostElement, createRetweetButtonElements } from "./utils/html-creators"

export default function search() {
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

  Array.from(
    document.querySelectorAll('div#profile div.profile-follow-buttons button.following-unfollowing')
  ).forEach(el => {
    el.addEventListener('click', e => onFollowOrUnfollowClick(e, e.target.classList.contains('follow-button') ? 'follow' : 'unfollow'))
  })

  Array.from(
    document.querySelectorAll('#profile-posts div.post-content__info.flex.flex-row.items-center.w-full div.pinned-button-wrapper.inline-block > button')
  ).forEach(el => {
    el.addEventListener('click', onClickTogglePinned)
  })

  /** @type { HTMLElement } */
  const searchResults = document.querySelector('div#search-results')

  var timer = null;
  document.querySelector('input#search').addEventListener('keyup', function (e) {
    clearTimeout(timer);
    const value = e.target.value;
    const searchType = e.target.dataset.type;

    timer = setTimeout(() => {
      searchResults.innerHTML = ''
      if (value === '') {
        searchResults.innerHTML = ''
      } else {

        searchTermByType(searchType, value)
          .then(data => {
            //TODO ISPISATI POSTOVE ILI User-e
            console.log(data)
            if (searchType == 'posts') {
              data.data.forEach(post => {
                // addNewPost(searchResults, post, post.fromNow)
                const postElement = createPostElement(post._id, post.content, post.postedBy, post.fromNow);
                searchResults.append(postElement);

                createElementForButtonWrapper(postElement, '.button-comment-wrapper', () => createCommentButtonElements(post))
                createElementForButtonWrapper(postElement, '.button-retweet-wrapper', () => createRetweetButtonElements(post))
                createElementForButtonWrapper(postElement, '.button-like-wrapper', () => createLikeButtonElements(post))
                if (post.hasDelete) {
                  createElementForButtonWrapper(postElement, '.delete-post-button-wrapper', createDeleteButtonElements)
                }
              })
            }
            else if (searchType === 'users') {

            }
          })
          .catch(err => {
            console.error(err)
          })
      }

    }, 1000)
  });

  setSeparatorHeightForAllReplies()
}
