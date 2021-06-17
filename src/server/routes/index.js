const loginRouter = require('./loginRouter')
const homeRouter = require('./homeRouter')
const logoutRouter = require('./logoutRouter')
const registrationRouter = require('./registrationRouter')
const postsRouter = require('./postsRouter')
const postAPI = require('./api/posts')
const profileRouter = require('./profileRouter')
const searchRouter = require('./searchRouter')

module.exports = {
  loginRouter,
  homeRouter,
  logoutRouter,
  registrationRouter,
  postAPI,
  profileRouter,
  searchRouter,
  postsRouter
}