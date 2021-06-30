import { addNewPostWithPredefinedButtons, createSearchResultRowElement, setSeparatorHeightForAllReplies } from "./utils/dom-manipulation"
import { addAllListenersToPosts, onFollowOrUnfollowClick, validateAndPreviewImagesForComment } from "./utils/listeners"
import { searchTermByType } from './utils/api'

export default function search() {
  var selectedImages = []

  addAllListenersToPosts(validateAndPreviewImagesForComment(selectedImages))

  Array.from(
    document.querySelectorAll('div#profile div.profile-follow-buttons button.following-unfollowing')
  ).forEach(el => {
    el.addEventListener('click', e => onFollowOrUnfollowClick(e, e.target.classList.contains('follow-button') ? 'follow' : 'unfollow'))
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
          .then(({ data }) => {
            data.forEach(elem => {
              if (searchType == 'posts') {
                addNewPostWithPredefinedButtons(searchResults, elem)
              }
              else if (searchType === 'users') {
                const div = createSearchResultRowElement(elem, true)
                searchResults.append(div);
              }
            })
          })
          .catch(err => {
            console.error(err)
          })
      }

    }, 1000)
  });

  setSeparatorHeightForAllReplies()
}
