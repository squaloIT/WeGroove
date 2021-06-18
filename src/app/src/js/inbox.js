import { searchUsers } from "./utils/api";
import { createRowAndAddListener, displaySelectedUsers, toggleButtonAvailability } from "./utils/dom-manipulation";
import { onClickCreateChat } from "./utils/listeners";

export default function inbox() {
  var timer = null;
  const selectedUsers = [];
  const contentWrapper = document.querySelector('div#inbox div.content-wrapper');
  const searchInput = document.querySelector('input#search-user')
  const createChatButton = document.querySelector('button#createChatButton')

  if (searchInput) {
    searchInput.addEventListener('keyup', function (e) {
      clearTimeout(timer)
      const value = e.target.value.trim()

      //* This means that users wants to delete some of the users that are already selected
      if (value == '' && e.keyCode == 8) {
        deleteUserFromSelectedUsers(selectedUsers, createChatButton, contentWrapper)
      }

      timer = setTimeout(function () {
        contentWrapper.innerHTML = "";

        if (value != '' && value.length > 2) {
          searchUsers(value)
            .then(({ data, status, msg }) => {
              if (status == 200) {
                data.forEach(user => {
                  if (selectedUsers.some(u => u._id == user._id)) {
                    console.log("ALREADY SELECTED")
                    return;
                  }

                  createRowAndAddListener(user, selectedUsers, searchInput, contentWrapper)
                })
              }
            })
            .catch(err => {
              console.error(err);
              alert("There was problem with searching users!")
            })
        }
      }, 1000)
    })
  }

  createChatButton.addEventListener('click', e => onClickCreateChat(e, selectedUsers))

  function deleteUserFromSelectedUsers(selectedUsers, createChatButton, contentWrapper) {
    selectedUsers.pop();
    toggleButtonAvailability(createChatButton, () => selectedUsers.length == 0)
    displaySelectedUsers(selectedUsers)
    contentWrapper.innerHTML = '';
  }
}