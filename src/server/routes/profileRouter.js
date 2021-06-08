const express = require('express')
const router = express.Router();
const UserModel = require('../db/schemas/UserSchema')
const PostModel = require('../db/schemas/PostSchema')
require('./../typedefs');

router.get('/:username', async (req, res, next) => {
  const user = await UserModel.findByUsernameOrID(req.params.username)
    .catch(err => {
      console.log(err);
      return res.redirect('/')
    })

  const allUserPosts = await PostModel.findAllUserPosts(user._id)
    .catch(err => {
      console.log(err);
      return res.redirect('/')
    })

  res.render('main', {
    page: 'profile',
    title: user.username,
    posts: allUserPosts,
    active: "Posts",
    userProfile: user,
    user: req.session.user
  })
})

router.get('/:username/:tab', async (req, res, next) => {
  const user = await UserModel.findByUsernameOrID(req.params.username)
    .catch(err => {
      console.log(err);
      return res.redirect('/')
    })

  /** @type { post } */
  const allUserPosts = await PostModel.findAllUserPosts(user._id, req.params.tab.toLowerCase())
    .catch(err => {
      console.log(err);
      return res.redirect('/')
    })

  res.render('main', {
    page: 'profile',
    title: user.username,
    posts: allUserPosts,
    active: req.params.tab,
    userProfile: user,
    user: req.session.user
  })
})

module.exports = router;