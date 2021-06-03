/**
 * Sends request to /api/posts to attempt creation of a new post.
 * @param { String } content 
 * @returns Promise
 */
function createPost(content) {
  return fetch(`${process.env.SERVER_URL_DEV}/api/posts`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({ content })
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
 * @returns Promise
 */
function replyToPost(_id, content) {
  return fetch(`${process.env.SERVER_URL_DEV}/api/posts/replyTo/${_id}`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ _id, content })
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

export {
  createPost,
  likePost,
  retweetPost,
  getPostData,
  replyToPost,
  deletePostByID
}