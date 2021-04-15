const express = require('express')
const handlebars = require('hbs')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000;

const loginRoute = require('./routes/loginRouter')
const { checkIsLoggedIn } = require('./middleware')

const server = app.listen(port, () => console.log("Server listening on port " + port))

const viewsPath = path.join(__dirname, "./templates/views")
const partialsPath = path.join(__dirname, "./templates/partials")

app.use(express.static(path.join(__dirname, './public')))

app.set('view engine', 'hbs')
app.set('views', viewsPath)
handlebars.registerPartials(partialsPath);

app.use('/login', loginRoute);
app.get("/", checkIsLoggedIn, (req, res, next) => {
  res.status(200).render('home', {
    title: "Home"
  });
})