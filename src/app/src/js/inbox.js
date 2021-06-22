import { searchUsers } from "./utils/api";
import { createRowAndAddListener, disableButton, displaySelectedUsers, toggleButtonAvailability } from "./utils/dom-manipulation";
import { addEmojiToInput, onClickCreateChat, onClickSaveChatNameButton, onSendMessage } from "./utils/listeners";
import { Picker } from 'emoji-picker-element'

export default function inbox() {
  var timer = null;
  const selectedUsers = [];
  const contentWrapper = document.querySelector('div#inbox div.content-wrapper');
  const searchInput = document.querySelector('input#search-user')
  const createChatButton = document.querySelector('button#createChatButton')
  const chatNameHeader = document.querySelector('div#inbox div.header-chat-name')
  const chatMessageInput = document.querySelector('div#inbox textarea.chat-message-ta')
  const emojiButton = document.querySelector('#emoji-button');
  const sendMessageButton = document.querySelector('#send-message-button');

  if (sendMessageButton) {
    disableButton(sendMessageButton, 'hover:bg-comment-button-blue-background')
    sendMessageButton.addEventListener('click', (e) => onSendMessage(e, chatMessageInput))

    chatMessageInput.addEventListener('keyup', e => {
      toggleButtonAvailability(
        sendMessageButton,
        () => e.target.value.trim() == 0,
        'hover:bg-comment-button-blue-background'
      )
      if (e.keyCode == 13 || e.which == 13) {
        onSendMessage(e, e.target)
      }
    })
  }

  if (emojiButton) {
    const emojiPicker = new Picker();
    const tooltip = document.querySelector('#chat-emojis-tooltip');
    emojiButton.addEventListener('click', (e) => {
      e.stopPropagation()
      tooltip.classList.toggle('hidden')
    })
    tooltip.appendChild(emojiPicker);
    emojiPicker.addEventListener('emoji-click', e => addEmojiToInput(e, chatMessageInput))
    document.querySelector('body').addEventListener('click', () => tooltip.classList.add('hidden'))
  }

  if (chatNameHeader) {
    chatNameHeader.addEventListener('click', function (e) {
      const chatId = e.target.dataset.chatId;
      const currentChatName = chatNameHeader.innerText;

      const modal = document.querySelector('#modal-container')
      modal.classList.remove('hidden')
      const chatName = modal.querySelector('input#chat-name');
      chatName.setAttribute('value', currentChatName)
      const saveButton = modal.querySelector('.save-modal-button')
      saveButton.addEventListener(
        'click',
        e => onClickSaveChatNameButton(e, modal, chatId)
      )

      if (chatName.value.trim().length == 0) {
        disableButton(saveButton, 'hover:bg-comment-button-blue')
      }

      const closebutton = modal.querySelector('.close-modal-button')
      closebutton.addEventListener('click', () => {
        modal.classList.add('hidden')
        chatName.value = ''
      })

      const cancelButton = modal.querySelector('.cancel-modal-button')
      cancelButton.addEventListener('click', () => {
        modal.classList.add('hidden')
        chatName.value = ''
      })

      chatName.addEventListener('keyup', function (e) {
        toggleButtonAvailability(saveButton, () => chatName.value.trim().length == 0);
      })

    })
  }

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

  createChatButton && createChatButton.addEventListener('click', e => onClickCreateChat(e, selectedUsers))

  function deleteUserFromSelectedUsers(selectedUsers, createChatButton, contentWrapper) {
    selectedUsers.pop();
    toggleButtonAvailability(createChatButton, () => selectedUsers.length == 0)
    displaySelectedUsers(selectedUsers)
    contentWrapper.innerHTML = '';
  }
}