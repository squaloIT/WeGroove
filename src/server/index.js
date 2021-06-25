require('dotenv').config()
const express = require('express')
var { Liquid } = require('liquidjs');
const path = require('path')
const bodyParser = require('body-parser');
const session = require('express-session')
const cookieParser = require('cookie-parser');
const { homeRouter, loginRouter, logoutRouter, postAPI, postsRouter, registrationRouter, profileRouter, searchRouter, searchAPI, messageRouter, notificationRouter, chatAPI, messageAPI, notificationAPI } = require('./routes/index')
const { checkIsLoggedIn, isRememberedCookiePresent, generateUserJWT, getNumberOfUnreadNotifications, getNumberOfUnreadChats } = require('./middleware')
const { connect } = require('./socket')

const app = express()
const port = process.env.PORT || 3000;
const db = require('./db/index')
const server = app.listen(port, () => console.log("Server listening on port " + port))
connect(server);

const viewsPath = path.join(__dirname, "./templates/views")
const partialsPath = path.join(__dirname, "./templates/partials")

console.log(`Is in production ${process.env.NODE_ENV === 'production'}`)
var engine = new Liquid({
  cache: process.env.NODE_ENV === 'production',
  extname: '.liquid',
  // root: [viewsPath, partialsPath]
});
app.engine('liquid', engine.express());

app.set('view engine', 'liquid');
app.set('views', viewsPath)

app.use(cookieParser(process.env.SECRET_KEY));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: true,
  saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, './../app/dist/')))
app.use('*/uploads/images', express.static(path.join(__dirname, 'uploads/images')))

app.use('/login', isRememberedCookiePresent, loginRouter);
app.use('/logout', logoutRouter);
app.use('/registration', registrationRouter);
app.use('/post', checkIsLoggedIn, getNumberOfUnreadNotifications, getNumberOfUnreadChats, generateUserJWT, postsRouter);
app.use('/profile', checkIsLoggedIn, getNumberOfUnreadNotifications, getNumberOfUnreadChats, generateUserJWT, profileRouter);
app.use('/search', checkIsLoggedIn, getNumberOfUnreadNotifications, getNumberOfUnreadChats, generateUserJWT, searchRouter);
app.use('/messages', checkIsLoggedIn, getNumberOfUnreadNotifications, getNumberOfUnreadChats, generateUserJWT, messageRouter);
app.use('/notifications', checkIsLoggedIn, getNumberOfUnreadNotifications, getNumberOfUnreadChats, generateUserJWT, notificationRouter);
app.use('/', checkIsLoggedIn, getNumberOfUnreadNotifications, getNumberOfUnreadChats, generateUserJWT, homeRouter);

app.use('/api/posts', postAPI);
app.use('/api/chat', chatAPI);
app.use('/api/search', searchAPI);
app.use('/api/message', messageAPI);
app.use('/api/notification', notificationAPI);
