const express = require('express')
const router = express.Router();
const PostModel = require('./../../db/schemas/PostSchema')
const { checkIsLoggedIn } = require('./../../middleware')

router.get('/', (req, res, next) => {

});

//! Need to send session with request!
router.post('/', checkIsLoggedIn, async (req, res, next) => {
  if (!req.body.content) {
    return res.sendStatus(400);
  }

  const createdPost = new PostModel({
    content: req.body.content,
    pinned: false,
    postedBy: req.session._id
  });
  const isSaved = await createdPost.save();

  return res.sendStatus(isSaved ? 200 : 400);
});

module.exports = router;