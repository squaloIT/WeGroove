const express = require('express')
const router = express.Router();
const UserModel = require('../db/schemas/UserSchema')

require('./../typedefs');

router.get('/', async (req, res, next) => {
  const user = await UserModel.findByUsernameOrID(req.params.username)
    .catch(err => {
      console.log(err);
      return res.redirect('/')
    })

  res.render('profile', {
    user
  })
})

router.get('/:username', async (req, res, next) => {
  const user = await UserModel.findByUsernameOrID(req.params.username)
    .catch(err => {
      console.log(err);
      return res.redirect('/')
    })

  res.render('main', {
    page: 'profile',
    title: user.username,
    user
  })
})

module.exports = router;