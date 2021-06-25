const loginRouter = require('./loginRouter')
const homeRouter = require('./homeRouter')
const logoutRouter = require('./logoutRouter')
const registrationRouter = require('./registrationRouter')
const postsRouter = require('./postsRouter')
const profileRouter = require('./profileRouter')
const searchRouter = require('./searchRouter')
const messageRouter = require('./messageRouter')
const notificationRouter = require('./notificationRouter')
const postAPI = require('./api/post')
const chatAPI = require('./api/chat')
const searchAPI = require('./api/search')
const messageAPI = require('./api/message')
const notificationAPI = require('./api/notification')

module.exports = {
  loginRouter,
  homeRouter,
  logoutRouter,
  registrationRouter,
  postAPI,
  chatAPI,
  searchAPI,
  messageAPI,
  profileRouter,
  notificationRouter,
  searchRouter,
  messageRouter,
  postsRouter,
  notificationAPI
}