const loginRouter = require('./loginRouter')
const homeRouter = require('./homeRouter')
const logoutRouter = require('./logoutRouter')
const registrationRouter = require('./registrationRouter')
const postsRouter = require('./postsRouter')
const postAPI = require('./api/posts')
const searchAPI = require('./api/search')
const profileRouter = require('./profileRouter')
const searchRouter = require('./searchRouter')
const messageRouter = require('./messageRouter')

module.exports = {
  loginRouter,
  homeRouter,
  logoutRouter,
  registrationRouter,
  postAPI,
  searchAPI,
  profileRouter,
  searchRouter,
  messageRouter,
  postsRouter
}