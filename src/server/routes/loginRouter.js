const express = require('express')
const router = express.Router();
const userModel = require('../db/schemas/UserSchema')
const bcrypt = require('bcrypt');

router.get('/', (req, res, next) => {
  res.status(200).render('login', {
    title: "Login"
  });
})

router.post('/', async (req, res, next) => {
  const { email, password } = req.body;

  const foundUser = await userModel.findOne({ email });
  if (!foundUser) {
    return res.status(400).render('login', {
      msg: "There is no user with that email or password",
      status: 400,
      email,
      password
    })
  }

  const match = await bcrypt.compare(password, foundUser.password)
  if (!match) {
    return res.status(400).render('login', {
      msg: "There is no user with that username or password",
      status: 400,
      email,
      password
    })
  }

  const user = foundUser.getDataForSession()
  req.session.user = user;
  return res.status(200).render('home', { user })
})

module.exports = router;