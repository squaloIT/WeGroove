/**
 * Sends request to /api/posts to attempt creation of a new post.
 * @param { String } content 
 * @param { Array.<File> } selectedImages 
 * @returns Promise
 */
function createPost(content, selectedImages) {
  const formData = new FormData()

  formData.append('content', content)
  for (let i = 0; i < selectedImages.length; i++) {
    formData.append('images', selectedImages[i]);
  }

  return fetch(`${process.env.SERVER_URL_DEV}/api/posts`, {
    method: "POST",
    body: formData
  })
}
/**
 * 
 * @param { String } _id 
 * @returns Promise
 */
function likePost(_id) {
  return fetch(`${process.env.SERVER_URL_DEV}/api/posts/like`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ _id })
  })
}
/**
 * 
 * @param { String } _id 
 * @returns Promise
 */
function retweetPost(_id) {
  return fetch(`${process.env.SERVER_URL_DEV}/api/posts/retweet`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ _id })
  })
}
/**
 * 
 * @param { String } _id 
 * @returns Promise
 */
function getPostData(_id) {
  return fetch(`${process.env.SERVER_URL_DEV}/api/posts/${_id}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  })
}
/** 
 * @param { String } _id 
 * @param { String } content 
 * @param { Array.<File> } selectedImages 
 * @returns Promise
 */
function replyToPost(_id, content, selectedImages) {
  const formData = new FormData()

  formData.append('content', content)
  formData.append('_id', _id)

  for (let i = 0; i < selectedImages.length; i++) {
    formData.append('images', selectedImages[i]);
  }

  return fetch(`${process.env.SERVER_URL_DEV}/api/posts/replyTo/${_id}`, {
    method: 'POST',
    body: formData
  })
}

/**
 * 
 * @param {String} id 
 * @returns Promise
 */
function deletePostByID(id) {
  return fetch(`${process.env.SERVER_URL_DEV}/api/posts/delete/${id}`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json"
    }
  })
}

function getAllPostsForUserAndSelectedTab(tabId) {
  return fetch(`${process.env.SERVER_URL_DEV}/api/posts/profile/${tabId}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
}
/**
 * 
 * @param {string} profileId 
 * @param {string } action 
 * @returns { Promise }
 */
function followOrUnfollowUser(profileId, action) {
  return fetch(`${process.env.SERVER_URL_DEV}/profile/${action}/${profileId}`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
}
/**
 * Toggles pin boolean for 
 * @param {string} postId 
 * @param {boolean} pinned 
 * @returns { Promise }
 */
function togglePinned(postId, pinned) {
  return fetch(`${process.env.SERVER_URL_DEV}/api/posts/pin/${postId}`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ pinned: !pinned })
  })
    .then(res => res.json())
}
/**
 * Searches for users in search page
 * @param {String} type 
 * @param {String} searchTerm 
 * @returns { Promise }
 */
function searchTermByType(type, searchTerm) {
  return fetch(`${process.env.SERVER_URL_DEV}/api/search/${type}/${searchTerm}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
}
/**
 * Searches for users on inbox page
 * @param {String} searchTerm 
 * @returns { Promise }
 */
function searchUsers(searchTerm) {
  return fetch(`${process.env.SERVER_URL_DEV}/api/search/inbox/${searchTerm}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
}
/**
 * 
 * @param {Array.<user>} selectedUsers 
 * @returns { Promise }
 */
function createChat(selectedUsers) {
  return fetch(`${process.env.SERVER_URL_DEV}/api/chat/create`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      users: selectedUsers
    })
  }).then(res => res.json())
}
/**
 * 
 * @param {string} chatName 
 * @param {string} chatId 
 * @returns { Promise }
 */
function changeChatName(chatName, chatId) {
  return fetch(`${process.env.SERVER_URL_DEV}/api/chat/change-chat-name`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ chatName, chatId })
  }).then(res => res.json())
}
/**
 * 
 * @param {string} chatId 
 * @param {string} content 
 * @returns { Promise }
 */
function sendMessage(chatId, content) {
  return fetch(`${process.env.SERVER_URL_DEV}/api/message/sendMessage`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ chatId, content })
  }).then(res => res.json())
}
/**
 * 
 * @param {string} _id
 * @returns { Promise }
 */
function sendNotificationRead(_id) {
  return fetch(`${process.env.SERVER_URL_DEV}/api/notification/read`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ notificationId: _id })
  }).then(res => res.json())
}
/**
 * 
 * @param {string} _id
 * @returns { Promise }
 */
function getNumberOfUnreadForUser(_id) {
  return fetch(`${process.env.SERVER_URL_DEV}/api/message/unread-number`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => res.json())
}

function setSeenForMessagesInChat(chatId) {
  return fetch(`${process.env.SERVER_URL_DEV}/api/message/seen-chat-messages`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ chatId })
  }).then(res => res.json())
}


export {
  searchTermByType,
  searchUsers,
  changeChatName,
  createPost,
  likePost,
  retweetPost,
  getPostData,
  replyToPost,
  deletePostByID,
  followOrUnfollowUser,
  togglePinned,
  createChat,
  getAllPostsForUserAndSelectedTab,
  sendMessage,
  sendNotificationRead,
  getNumberOfUnreadForUser,
  setSeenForMessagesInChat
}