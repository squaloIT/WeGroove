const express = require('express')
const router = express.Router();
const userModel = require('../db/schemas/UserSchema')
const bcrypt = require('bcrypt');
const session = require('express-session');

router.get('/', (req, res, next) => {
  res.status(200).render('register', {
    title: "Registration"
  });
})

router.post('/', async (req, res, next) => {
  if (req.body.username && req.body.password && req.body.firstName && req.body.lastName && req.body.email) {

    try {
      var userWhichAlreadyExists = await userModel.isAlreadyCreated(req.body.username, req.body.email)
    } catch (err) {
      res.status(500).render('register', { msg: "Something went wrong while trying to find existing user.", status: 500 });
      return;
    }

    if (userWhichAlreadyExists) {
      if (userWhichAlreadyExists.username == req.body.username) {
        res.status(400).render('register', { msg: "User with that username already exists.", status: 400 });
        return;
      }
      if (userWhichAlreadyExists.email == req.body.email) {
        res.status(400).render('register', { msg: "User with that email already exists.", status: 400 });
        return;
      }
    }

    try {
      const hash = await bcrypt.hash(req.body.password, 8)

      var createdUser = new userModel({
        username: req.body.username,
        password: hash,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName
      })
      var crtUser = await createdUser.save();

      if (crtUser) {
        req.session.user = crtUser.getDataForSession()
        return res.redirect('/');
      }
    } catch (err) {
      res.status(500).render('register', { msg: "Something went wrong while trying to create new user.", status: 500 });
      console.log(err)
      return;
    }
  } else {
    res.status(400).render('register', { msg: "Please insert all fields! ", status: 400 })
  }
})
module.exports = router;