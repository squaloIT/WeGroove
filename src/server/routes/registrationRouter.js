const express = require('express')
const router = express.Router();
const userModel = require('../db/schemas/UserSchema')

router.get('/', (req, res, next) => {
  res.status(200).render('register', {
    title: "Registration"
  });
})

router.post('/', async (req, res, next) => {
  if (req.body.username && req.body.password && req.body.firstName && req.body.lastName && req.body.email) {
    try {
      var userWhichAlreadyExists = await userModel.findOne({
        $or: [
          { username: req.body.username },
          { email: req.body.email }
        ]
      })
    } catch (err) {
      res.status(500).json({ msg: "Something went wrong while trying to find existing user.", status: 500 });
      return;
    }

    if (userWhichAlreadyExists) {
      if (userWhichAlreadyExists.username == req.body.username) {
        res.status(400).json({ msg: "User with that username already exists.", invalidField: 'username', status: 400 })
        return;
      }
      if (userWhichAlreadyExists.email == req.body.email) {
        res.status(400).json({ msg: "User with that email already exists.", invalidField: 'email', status: 400 })
        return;
      }

    }
    try {
      var createdUser = await userModel.create({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName
      })
    } catch (err) {
      res.status(500).json({ msg: "Something went wrong while trying to create new user.", status: 500 });
      console.log(err)
      return;
    }

    if (createdUser) {
      res.status(200).json({ msg: "User created", status: 200, createdUser })
      //TODO - Renderujem novu stranicu kad se ovo desi!
    }
  } else {
    res.status(400).json({ msg: "Please insert all fields! ", status: 400, invalidField: 'all' })
  }
})
module.exports = router;