const express = require('express')
const router = express.Router();
const UserModel = require('../db/schemas/UserSchema')
const PostModel = require('../db/schemas/PostSchema')
require('./../typedefs');

router.post('/:action/:profileId', async (req, res, next) => {
  if (!req.session.user._id || !req.params.profileId) {
    return res.status(400).json({
      msg: `There was an error while trying to ${req.params.action} user!`,
      status: 400
    })
  }
  try {
    var user = await UserModel.findByUsernameOrID(req.session.user._id)
    var profile = await UserModel.findByUsernameOrID(req.params.profileId)
  } catch (err) {
    return res.status(400).json({
      msg: `There was an error while trying to ${req.params.action} user!`,
      status: 400
    })
  }

  if (!user || !profile) {
    return res.status(400).json({
      msg: `There was an error while trying to ${req.params.action} user!`,
      status: 400
    })
  }

  if (req.params.action == 'follow') {
    user.following.push(req.params.profileId)
    profile.followers.push(req.params.profileId)
  }
  if (req.params.action == 'unfollow') {
    user.following.pull(req.params.profileId)
    profile.followers.pull(req.params.profileId)
  }
  Promise.all([
    profile.save(),
    user.save()
  ])
    .then(([newProfile, newUser]) => {
      console.log(JSON.stringify(newUser, null, 3))
      req.session.user = newUser.getDataForSession()
      return res.status(201).json({
        msg: 'Operation successfull',
        status: 201,
        data: user
      })
    })
    .catch(err => {
      console.log(err);
      return res.status(400).json({
        msg: `There was an error while trying to ${req.params.action} user!`,
        status: 400
      })
    })
})

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