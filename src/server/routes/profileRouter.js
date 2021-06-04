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
    user
  })
})

module.exports = router;