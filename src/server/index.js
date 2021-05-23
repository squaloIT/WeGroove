require('dotenv').config()
const express = require('express')
var { Liquid } = require('liquidjs');
const path = require('path')
const bodyParser = require('body-parser');
const session = require('express-session')
const cookieParser = require('cookie-parser');
const loginRouter = require('./routes/loginRouter')
const homeRouter = require('./routes/homeRouter')
const logoutRouter = require('./routes/logoutRouter')
const registrationRouter = require('./routes/registrationRouter')
const postAPI = require('./routes/api/posts')
const { checkIsLoggedIn, isRememberedCookiePresent } = require('./middleware')

const app = express()
const port = process.env.PORT || 3000;
const db = require('./db/index')
const server = app.listen(port, () => console.log("Server listening on port " + port))

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

app.use('/login', isRememberedCookiePresent, loginRouter);
app.use('/logout', logoutRouter);
app.use('/registration', registrationRouter);
app.use('/', checkIsLoggedIn, homeRouter);

app.use('/api/posts', postAPI);
