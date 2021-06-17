const express = require('express');
const { fillPostAdditionalFields } = require('../../utils');
const router = express.Router();
const PostModel = require('./../../db/schemas/PostSchema')
const UserModel = require('./../../db/schemas/UserSchema')
const { checkIsLoggedIn } = require('./../../middleware')
require('./../../typedefs');

router.get('/:type/:searchTerm', checkIsLoggedIn, async (req, res) => {
  var results = null;

  if (req.params.type == 'posts') {
    const allPosts = await PostModel.getAllPosts(req.session.user)
    results = await PostModel.find({
      content: { $regex: req.params.searchTerm, $options: "i" }
    }).lean()

    results = results.map(post => {
      /** @type { post } */
      const p = fillPostAdditionalFields(post, allPosts)

      p.hasDelete = p.postedBy._id == req.session.user._id
      p.isLiked = p.likes.map(id => String(id)).includes(req.session.user._id)
      p.isRetweeted = p.retweetUsers.map(id => String(id)).includes(req.session.user._id)

      return p
    })
  }

  return res.status(200).json({
    msg: "Successfully founded search results",
    status: 200,
    data: results
  })
})


module.exports = router;